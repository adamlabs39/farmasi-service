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
import axiosInstance from "../configurations/axios-instance.js";
import {INVENTORY_URL, REKAM_MEDIS_URL} from "../helpers/constants.js";
import InternalServerException from "../errors/internal-server-exception.js";

export default class PenjualanObatService {

    static async create(req) {
        ZodValidator.validate(PenjualanObatValidation.CREATE_OTC, req);
        const transaction = await sequelizeInstance.transaction();

        // create no transaksi
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

            // region UPLOAD TO INVENTORY
            const mutasiItems = [];

            for (const item of req.items) {
                for (const catatan of item.catatan_stok) {
                    mutasiItems.push({
                        item_uuid: item.item_medis_uuid,
                        exp_date: catatan.expired_date,
                        stok_awal: catatan.stock_before,
                        stok_mutasi: catatan.stock_before - catatan.quantity,
                        jenis_stok_uuid: item.jenis_stok_uuid,
                        lokasi_stok_uuid: req.lokasi_stok_uuid,
                        type: "defisit"
                    });
                }

            }

            try {
                await axiosInstance.post(`${INVENTORY_URL}/mutasi`, {
                    sumber_mutasi: "pelayanan",
                    with_check_stock: true,
                    code: req.no_transaksi,
                    keterangan: {
                        description: "Penjualan Obat (OTC)",
                    },
                    items: mutasiItems,
                }, {
                    headers: {
                        Authorization: req.token
                    }
                });
            } catch (error) {
                if (error.response) {
                    throw new InternalServerException("[SERVER INVENTORY]: " + error.response.data.message);
                } else if (error.request) {
                    throw new InternalServerException("Tidak ada respons dari server inventory");
                } else {
                    throw new InternalServerException("Kesalahan saat menyiapkan permintaan inventory");
                }
            }
            // endregion

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
            const mutasiItems = [];

            for (const item of items) {
                if (item.catatan_stok) {
                    for (const catatan of item.catatan_stok) {
                        const stockMedis = await StockMedisRepository.addQuantity(catatan, transaction);

                        mutasiItems.push({
                            item_uuid: item.item_medis_uuid,
                            exp_date: stockMedis.exp_date,
                            stok_awal: stockMedis.sisa_stok,
                            stok_mutasi: stockMedis.sisa_stok + catatan.quantity,
                            jenis_stok_uuid: item.jenis_stok_uuid,
                            lokasi_stok_uuid: stockMedis.lokasi_stok_uuid,
                            type: "surplus"
                        })
                    }
                }
            }


            try {
                await axiosInstance.post(`${INVENTORY_URL}/mutasi`, {
                    sumber_mutasi: "pelayanan",
                    with_check_stock: true,
                    code: req.no_transaksi,
                    keterangan: {
                        description: "Penjualan Obat (OTC)",
                    },
                    items: mutasiItems,
                }, {
                    headers: {
                        Authorization: req.token
                    }
                });
            } catch (error) {
                if (error.response) {
                    throw new InternalServerException("[SERVER INVENTORY]: " + error.response.data.message);
                } else if (error.request) {
                    throw new InternalServerException("Tidak ada respons dari server inventory");
                } else {
                    throw new InternalServerException("Kesalahan saat menyiapkan permintaan inventory");
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