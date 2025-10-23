import ZodValidator from "../validations/zod-validator.js";
import PenjualanObatValidation from "../validations/penjualan-obat-validation.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import PenjualanObatRepository from "../repositories/penjualan-obat-repository.js";
import Utils from "../helpers/utils.js";
import { setRangeDate, toEpochDate } from "../helpers/date-helper.js";
import StockMedisRepository from "../repositories/stock-medis-repository.js";
import KonfigurasiHargaRepository from "../repositories/konfigurasi-harga-repository.js";
import DataMasterItemMedisRepository from "../repositories/datamaster-item-medis-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";
import axiosInstance from "../configurations/axios-instance.js";
import { INVENTORY_URL, REKAM_MEDIS_URL } from "../helpers/constants.js";
import InternalServerException from "../errors/internal-server-exception.js";
import { uuidv7 } from "uuidv7";
import NotfoundException from "../errors/notfound-exception.js";

export default class PenjualanObatService {
  static async create(data, author, token) {
    ZodValidator.validate(PenjualanObatValidation.CREATE_OTC, data);

    const faskesUuid = author.faskesUuid;
    let transaction;
    let inventoryReducedItems = [];

    try {
      const stockUuids = data.items.map((item) => item.stock_uuid);
      if (stockUuids.length === 0) {
        throw new BadRequestException("Item obat tidak ditemukan di stok.");
      }

      const stockDetails = await StockMedisRepository.findStocksWithDetails(
        stockUuids
      );

      const stockMap = new Map(
        stockDetails.map((stock) => [stock.uuid, stock])
      );

      const penjualanUuid = uuidv7();
      const konfigurasiHarga = await KonfigurasiHargaRepository.get(faskesUuid);

      let totalHargaCalculated = 0;
      const processedItems = [];

      for (const item of data.items) {
        ZodValidator.validate(PenjualanObatValidation.CREATE_OTC_ITEM, item);

        const stockDetail = stockMap.get(item.stock_uuid);
        if (
          !stockDetail ||
          !stockDetail.item_medis_jenis_stok ||
          !stockDetail.item_medis_jenis_stok.item_medis
        ) {
          throw new NotfoundException(
            `Stok dengan UUID ${item.stock_uuid} tidak ditemukan atau tidak memiliki item medis terkait.`
          );
        }

        if (stockDetail.sisa_stok < item.qty) {
          throw new BadRequestException(
            `Stok untuk ${stockDetail.item_medis_jenis_stok.item_medis.name} (Batch UUID: ${item.stock_uuid}) tidak mencukupi. Sisa: ${stockDetail.sisa_stok}, diminta: ${item.qty}`
          );
        }

        const itemMedisJenisStokUuid = stockDetail.item_medis_jenis_stok_uuid;
        const itemMedisUuid = stockDetail.item_medis_jenis_stok.item_medis_uuid;
        const itemMedisData = stockDetail.item_medis_jenis_stok.item_medis;

        const hargaInfo =
          await DataMasterItemMedisRepository.findLatestPricesForItemJenisStok(
            itemMedisJenisStokUuid,
            konfigurasiHarga.metode_hpp === "avg"
          );
        if (!hargaInfo) {
          throw new BadRequestException(
            `Harga untuk item medis ${itemMedisUuid} tidak ditemukan.`
          );
        }
        const hargaSatuan = hargaInfo.dataValues.harga;

        totalHargaCalculated += (hargaSatuan - (item.diskon || 0)) * item.qty;

        processedItems.push({
          stock_uuid: item.stock_uuid,
          item_medis_uuid: itemMedisUuid,
          jenis_stok_uuid: stockDetail.item_medis_jenis_stok.jenis_stok_uuid,
          qty: item.qty,
          diskon: item.diskon || 0,
          uuid: uuidv7(),
          penjualan_obat_uuid: penjualanUuid,
          faskes_uuid: faskesUuid,
          harga_satuan: hargaSatuan,
          satuan_uuid: itemMedisData.satuan_penggunaan_uuid,
          satuan_name: itemMedisData.satuan_penggunaan?.name || null,
          exp_date: stockDetail.exp_date,
        });
      }

      const initialData = {
        ...data,
        uuid: penjualanUuid,
        total_item: processedItems.length,
        total_harga: totalHargaCalculated,
        status: "belum_lunas",
        faskes_uuid: faskesUuid,
        items: undefined,
      };

      const reduceApiCalls = processedItems.map((item) => {
        const payload = {
          jenis_stok_uuid: item.jenis_stok_uuid,
          item_uuid: item.item_medis_uuid,
          quantity: item.qty,
          lokasi_stok_uuid: data.lokasi_stok_uuid,
          sumber_mutasi: "pelayanan",
          kode_referensi: initialData.no_transaksi,
        };
        return axiosInstance.post(
          `${INVENTORY_URL}/inventory/stok/reduce`,
          payload,
          {
            headers: { Authorization: token },
          }
        );
      });

      await Promise.all(reduceApiCalls);
      inventoryReducedItems = processedItems;

      transaction = await sequelizeInstance.transaction();

      await PenjualanObatRepository.createOtc(initialData, transaction);

      for (const itemData of processedItems) {
        await PenjualanObatRepository.createOtcItem(itemData, transaction);
      }

      await transaction.commit();

      return initialData;
    } catch (error) {
      if (transaction) await transaction.rollback();

      if (inventoryReducedItems.length > 0) {
        try {
          const compensationPayload = {
            sumber_mutasi: "pelayanan",
            kode_referensi: data.no_transaksi,
            items: inventoryReducedItems.map((item) => ({
              item_uuid: item.item_medis_uuid,
              lokasi_stok_uuid: data.lokasi_stok_uuid,
              jenis_stok_uuid: item.jenis_stok_uuid,
              quantity: item.qty,
              exp_date: item.exp_date || null,
              harga_satuan: item.harga_satuan || 0,
            })),
          };
          axiosInstance.post(
            `${INVENTORY_URL}"/inventory/stok/increase"`,
            compensationPayload,
            {
              headers: { Authorization: token },
            }
          );
        } catch (compError) {
          console.error("Compensation error:", compError);
        }
      }
      throw error;
    }
  }

  static async batalOtc(req) {
    const transaction = await sequelizeInstance.transaction();

    try {
      ZodValidator.validate(PenjualanObatValidation.BATAL_OTC, req);
      req.status = "cancel";
      await PenjualanObatRepository.updateOtc(req);

      // bring back the stock
      const items = await PenjualanObatRepository.getAllCatatanStok(req);
      const mutasiItems = [];

      for (const item of items) {
        if (item.catatan_stok) {
          for (const catatan of item.catatan_stok) {
            const stockMedis = await StockMedisRepository.addQuantity(
              catatan,
              transaction
            );

            mutasiItems.push({
              item_uuid: item.item_medis_uuid,
              exp_date: stockMedis.exp_date,
              stok_awal: stockMedis.sisa_stok,
              stok_mutasi: stockMedis.sisa_stok + catatan.quantity,
              jenis_stok_uuid: item.jenis_stok_uuid,
              lokasi_stok_uuid: stockMedis.lokasi_stok_uuid,
              type: "surplus",
            });
          }
        }
      }

      await transaction.commit();
    } catch (e) {
      await transaction.rollback();
      throw e;
    }
  }

  static async getAll(req) {
    setRangeDate(req);

    ZodValidator.validate(PenjualanObatValidation.GET_ALL, req);

    return await PenjualanObatRepository.getAllOtc(req);
  }

  static async getByUuid(req) {
    return await PenjualanObatRepository.getOtcByUuid(req);
  }

  static async generateCode(req) {
    let isAvailable = false;

    while (!isAvailable) {
      req.no_transaksi = Utils.generate4Code("OTC");
      const result = await PenjualanObatRepository.getByCode(req);

      if (result === null) {
        isAvailable = true;
      }
    }

    return {
      code: req.no_transaksi,
    };
  }
}
