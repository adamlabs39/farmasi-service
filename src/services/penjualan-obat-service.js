import ZodValidator from "../validations/zod-validator.js";
import PenjualanObatValidation from "../validations/penjualan-obat-validation.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import PenjualanObatRepository from "../repositories/penjualan-obat-repository.js";
import Utils from "../helpers/utils.js";
import {setRangeDate, toEpochDate} from "../helpers/date-helper.js";
import StockMedisRepository from "../repositories/stock-medis-repository.js";
import KonfigurasiHargaRepository from "../repositories/konfigurasi-harga-repository.js";
import DataMasterItemMedisRepository from "../repositories/datamaster-item-medis-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";

export default class PenjualanObatService {

    static async create(req) {
        ZodValidator.validate(PenjualanObatValidation.CREATE_OTC, req);
        const transaction = await sequelizeInstance.transaction();

        // create no transaksi
        req.no_transaksi = Utils.generate4Code('OTC');

        req.tanggal_pembelian = toEpochDate(new Date());
        req.total_item = 0;
        req.total_harga = 0;
        req.status = 'belum_lunas';

        try {
            const penjualan = await PenjualanObatRepository.createOtc(req, transaction);

            const itemMedises = await DataMasterItemMedisRepository.getSome(req.items.map(item => item.item_medis_uuid));

            for (const item of req.items) {
                ZodValidator.validate(PenjualanObatValidation.CREATE_OTC_ITEM, item);
                item.penjualan_obat_uuid = penjualan.uuid;
                item.faskes_uuid = req.faskes_uuid;

                req.total_item += 1;

                // get konfigurasi harga
                const konfigurasiHarga = await KonfigurasiHargaRepository.get(req.faskes_uuid);

                // get harga satuan for penjualan item
                const itemMedis = await DataMasterItemMedisRepository.getItemMedisJenisStok({
                    item_medis_uuid: item.item_medis_uuid,
                    jenis_stok_uuid: item.jenis_stok_uuid
                })

                if (!itemMedis) {
                    throw new BadRequestException(`Item medis uuid tidak cocok dengan jenis stok uuid`);
                }

                if (!itemMedis.detail_harga) {
                    throw new BadRequestException(`Item medis tidak memiliki harga`);
                }

                if (konfigurasiHarga.metode_hpp === 'last') {
                    item.harga_satuan = itemMedis.detail_harga[0].harga_terakhir;
                } else {
                    item.harga_satuan = itemMedis.detail_harga[0].harga_avg;
                }

                req.total_harga += (item.harga_satuan - item.diskon) * item.qty;

                item.catatan_stok = await StockMedisRepository.reduceQuantity({
                    item_medis_uuid: item.item_medis_uuid,
                    jenis_stok_uuid: item.jenis_stok_uuid,
                    quantity: item.qty,
                    metode_pemotongan_stok: konfigurasiHarga.metode_pemotongan_stok,
                    name: itemMedises.find(itemMedis => itemMedis.uuid === item.item_medis_uuid)?.name,
                    lokasi_stok_uuid: penjualan.lokasi_stok_uuid
                }, transaction);


                await PenjualanObatRepository.createOtcItem({
                    ...item,
                    satuan_uuid : itemMedises.find(itemMedis => itemMedis.uuid === item.item_medis_uuid)?.satuan_penggunaan?.name},
                    transaction);
            }

            await PenjualanObatRepository.updateOtc({
                uuid: penjualan.uuid,
                total_item: req.total_item,
                total_harga: req.total_harga
            }, transaction);

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async batalOtc(req) {
        const transaction = await sequelizeInstance.transaction();

        try {
            ZodValidator.validate(PenjualanObatValidation.BATAL_OTC, req);
            req.status = 'cancel';
            await PenjualanObatRepository.updateOtc(req);

            // bring back the stock
            const items = await PenjualanObatRepository.getAllCatatanStok(req);
            for (const item of items) {
                if (item.catatan_stok) {
                    for (const catatan of item.catatan_stok) {
                        await StockMedisRepository.addQuantity(catatan, transaction);
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
            req.no_transaksi = Utils.generate4Code('OTC');
            const result = await PenjualanObatRepository.getByCode(req);

            if (result === null) {
                isAvailable = true;
            }
        }

        return {
            "code": req.no_transaksi
        };
    }
}