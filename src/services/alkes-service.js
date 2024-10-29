import PrescriptionRepository from "../repositories/prescription-repository.js";
import PrescriptionValidation from "../validations/prescription-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import BadRequestException from "../errors/bad-request-exception.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import DataMasterLokasiStokRepository from "../repositories/datamaster-lokasi-stok-repository.js";
import InternalServerException from "../errors/internal-server-exception.js";
import Utils from "../helpers/utils.js";
import axiosInstance from "../configurations/axios-instance.js";
import {REKAM_MEDIS_URL} from "../helpers/constants.js";
import {toEpochDate} from "../helpers/date-helper.js";
import KonfigurasiHargaService from "./konfigurasi-harga-service.js";
import StockMedisRepository from "../repositories/stock-medis-repository.js";
import DataMasterItemMedisRepository from "../repositories/datamaster-item-medis-repository.js";
import DataMasterBentukRacikanRepository from "../repositories/datamaster-bentuk-racikan-repository.js";
import AlkesValidation from "../validations/alkes-validation.js";
import AlkesRepository from "../repositories/alkes-repository.js";

export default class AlkesService {
    static async getByUuid(uuid) {
        const alkes = await AlkesRepository.getByUuid(uuid);
        if (alkes === null) {
            throw new BadRequestException("data tidak ditemukan");
        }
        return alkes;
    }

    static async orderAlkes(req) {
        req.order_status = 1;
        const transaction = await sequelizeInstance.transaction();

        // generate no prescription
        req.no_order_alkes = Utils.generate4Code('ORD');

        // validate input
        ZodValidator.validate(AlkesValidation.ORDER_ALKES, req);
        if (req.alkes === null || req.alkes === undefined) {
            throw new BadRequestException("'alkes' tidak boleh kosong");
        }

        req.harga_total = 0;

        // get default lokasi stok
        const lokasiStocks = await DataMasterLokasiStokRepository.getAll({
            faskes_uuid: req.faskes_uuid,
            jenis_lokasi: "depo",
            limit: 100
        });

        const lokasi = lokasiStocks.data.find(
            item => item
                .default_tujuan_order_permintaan
                .includes(
                    Utils.pelayananToJenisStockCode(req.jenis_pelayanan)
                )
        );

        if (!lokasi) {
            throw new InternalServerException(`lokasi stok belum di set untuk pelayanan ${req.jenis_pelayanan}`);
        }

        req.lokasi_stok_uuid = lokasi.uuid;

        try {
            // create alkes
            const order_alkes = await AlkesRepository.createAlkes(req, transaction);
            const order_alkes_uuid = order_alkes.dataValues.uuid;
            order_alkes.dataValues.alkes_items = [];

            // create alkes item
            for (const item of req.alkes) {
                item.order_alkes_uuid = order_alkes_uuid;
                item.faskes_uuid = req.faskes_uuid;

                ZodValidator.validate(AlkesValidation.CREATE_ALKES_ITEM, item);

                item.harga_satuan = 0;

                const alkes_item =
                    await AlkesRepository.createAlkesItem(item, transaction);
                order_alkes.dataValues.alkes_items.push(alkes_item);
            }

            await transaction.commit();

            return order_alkes;
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    static async addAlkes(req) {
        const transaction = await sequelizeInstance.transaction();

        if (req.obat === null || req.obat === undefined) {
            throw new BadRequestException("'obat' tidak boleh kosong");
        }

        try {
            for (const item of req.obat) {
                item.prescription_uuid = req.prescription_uuid;
                item.sisa_qty_order = item.medication_qty;
                item.faskes_uuid = req.faskes_uuid;

                ZodValidator.validate(PrescriptionValidation.CREATE_PRESCRIPTION_ITEM, item);

                const prescription_item =
                    await PrescriptionRepository.createPrescriptionItem(item, transaction);

                if (item.racikan !== null && item.racikan !== undefined) {
                    for (const racikan of item.racikan) {
                        ZodValidator.validate(PrescriptionValidation.CREATE_PRESCRIPTION_ITEM_RACIKAN, item);

                        racikan.faskes_uuid = req.faskes_uuid;
                        racikan.prescription_item_uuid = prescription_item.dataValues.uuid;

                        await PrescriptionRepository.createPrescriptionItemRacikan(racikan, transaction);
                    }
                }
            }


            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    static async deleteAlkes(req) {
        ZodValidator.validate(PrescriptionValidation.DELETE_PRESCRIPTION_ITEM, req);
        const result = await PrescriptionRepository.deletePrescriptionItem(req.prescription_uuid);
        if (result === 0) {
            throw new BadRequestException("data tidak ditemukan");
        }
        return result;
    }

    static async updatePrescription(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_PRESCRIPTION, req);
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateAlkesItem(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_OBAT, req);

        if (req.type === "racikan") {
            for (const racikan of req.racikan) {
                if (racikan.uuid === null || racikan.uuid === undefined || racikan.uuid === "") {
                    ZodValidator.validate(PrescriptionValidation.CREATE_PRESCRIPTION_ITEM_RACIKAN, racikan);
                    racikan.faskes_uuid = req.faskes_uuid;
                    racikan.prescription_item_uuid = req.uuid;

                    await PrescriptionRepository.createPrescriptionItemRacikan(racikan);

                    continue;
                }

                if (racikan.is_deleted) {
                    await PrescriptionRepository.deletePrescriptionItemRacikan(racikan.uuid);

                    continue;
                }

                if (racikan.is_updated) {
                    ZodValidator.validate(PrescriptionValidation.CREATE_PRESCRIPTION_ITEM_RACIKAN, racikan);

                    await PrescriptionRepository.editPrescriptionItemRacikan(racikan);
                }
            }
        }

        return await PrescriptionRepository.editPrescriptionItem(req);
    }

    static async getHistoryObat(req) {
        return await PrescriptionRepository.getHistoryObat(req);
    }

    static async getOrderBySomeUuid(req) {
        ZodValidator.validate(AlkesValidation.GET_SOME_ORDER, req);
        const rawData = await AlkesRepository.getOrderBySomeUuid(req);
        let data = [];

        for (const resep of rawData) {
            resep.dataValues.jumlah_item = resep.dataValues.alkes_items.length;

            resep.dataValues.lokasi_stok = resep.dataValues.lokasi_stok.name;

            resep.dataValues.alkes_items = undefined;

            data.push(resep.dataValues);
        }

        return data;
    }

    static async updateTelaah(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_TELAAH, req);
        req.status_telaah = true;
        return await PrescriptionRepository.editPrescription(req);
    }

    static async batalOrder(req) {
        ZodValidator.validate(PrescriptionValidation.BATAL_ORDER, req);
        req.order_status = 1;
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateVerifikasi(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_VERIFIKASI, req);

        const transaction = await sequelizeInstance.transaction();

        // get konfigurasi harga
        const konfigurasiHarga = await KonfigurasiHargaService.get(req);

        // get all prescription item
        const prescription = await PrescriptionRepository.getByUuid(req.uuid);


        try {
            req.total_harga = await this.setPriceInPrescription(prescription, konfigurasiHarga, transaction);

            // loop for reduce stock
            for (const obat of prescription.obat) {
                if (obat.is_compound) {
                    for (const racikan of obat.racikan) {
                        await StockMedisRepository.reduceQuantity({
                            item_medis_uuid: racikan.item_medis_uuid,
                            jenis_stok_uuid: racikan.jenis_stok_uuid,
                            quantity: racikan.medication_qty,
                            metode_pemotongan_stok: konfigurasiHarga.metode_pemotongan_stok,
                            name: racikan.item_medis.name,
                            lokasi_stok_uuid: prescription.lokasi_stok_uuid
                        }, transaction)
                    }
                } else {
                    await StockMedisRepository.reduceQuantity({
                        item_medis_uuid: obat.item_medis_uuid,
                        jenis_stok_uuid: obat.jenis_stok_uuid,
                        quantity: obat.medication_qty,
                        lokasi_stok_uuid: prescription.lokasi_stok_uuid,
                        metode_pemotongan_stok: konfigurasiHarga.metode_pemotongan_stok,
                        name: obat.item_medis.name
                    }, transaction)
                }
            }

            // update prescription
            req.order_status = 3;
            req.waktu_verifikasi = toEpochDate(new Date());
            await PrescriptionRepository.editPrescription(req, transaction);

            await transaction.commit();
        } catch (e) {
            await transaction.rollback();
            throw e;
        }

        return prescription;
    }

    static async updateSiapDiserahkan(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_SIAP_DISERAHKAN, req);
        req.order_status = 4;
        req.waktu_penyiapan = toEpochDate(new Date());
        return await PrescriptionRepository.editPrescription(req);
    }

    static async batalSiapDiserahkan(req) {
        ZodValidator.validate(PrescriptionValidation.BATAL_DISERAHKAN, req);
        req.order_status = 4;
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateDiserahkan(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_SERAHKAN, req);
        req.order_status = 5;
        req.waktu_pemberian = toEpochDate(new Date());
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateLokasiStok(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_LOKASI_STOK, req);
        return await PrescriptionRepository.editPrescription(req);
    }

    static async getAll(req) {
        ZodValidator.validate(PrescriptionValidation.GET_ALL, req);
        const rawData = await PrescriptionRepository.getAllPrescription(req);

        let resep_masuk = [];
        let obat_disiapkan = [];
        let penyerahan_obat = [];

        for (const resep of rawData) {
            for (const obat of resep.obat) {
                if (obat.is_chronic) {
                    resep.dataValues.is_chronic = true;
                }

                if (obat.is_compound) {
                    resep.dataValues.is_compound = true;
                }

                resep.dataValues.obat = undefined;
            }

            if (resep.order_status === 1) {
                resep_masuk.push(resep);
            } else if (resep.order_status === 3) {
                obat_disiapkan.push(resep);
            } else if (resep.order_status === 4) {
                penyerahan_obat.push(resep);
            }
        }

        return {
            resep_masuk,
            obat_disiapkan,
            penyerahan_obat
        }
    }

    static async updateJenisItem(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_JENIS_ITEM, req);

        if (req.is_racikan) {
            return await PrescriptionRepository.editPrescriptionItemRacikan(req);
        } else {
            return await PrescriptionRepository.editPrescriptionItem(req);
        }
    }

    static async setPriceInPrescription(prescription, konfigurasiHarga, transaction) {
        let totalHarga = 0;

        for (const item of prescription.obat) {
            if (item.is_compound) {
                for (const racikan of item.racikan) {
                    const hargaItem = await DataMasterItemMedisRepository.getPrice({
                        item_medis_uuid: racikan.item_medis_uuid,
                        jenis_stok_uuid: racikan.jenis_stok_uuid
                    });

                    if (hargaItem === null) {
                        throw new BadRequestException(`harga item medis ${racikan.item_medis.name} tidak ditemukan`);
                    }

                    if (konfigurasiHarga.metode_hpp === "avg") {
                        racikan.dataValues.harga_satuan = hargaItem.detail_harga[0].dataValues.harga_avg;
                    } else {
                        racikan.dataValues.harga_satuan = hargaItem.detail_harga[0].dataValues.harga_terakhir;
                    }

                    totalHarga += racikan.harga_satuan * racikan.medication_qty;

                    await PrescriptionRepository.editPrescriptionItemRacikan({
                        uuid: racikan.uuid,
                        harga_satuan: racikan.harga_satuan,
                    }, transaction)
                }

                // set tarif price
                const tarif = await DataMasterBentukRacikanRepository.getByUuid(item.bentuk_racikan_uuid);
                let multiplier = 1;

                if (konfigurasiHarga.metode_biaya_racikan === "paket") {
                    multiplier = 1 + (item.medication_qty % tarif.jumlah);
                } else if (konfigurasiHarga.metode_biaya_racikan === "item") {
                    multiplier = item.racikan.length;
                } else {
                    throw new BadRequestException(`metode biaya racikan belum di set`);
                }

                totalHarga += ((tarif.tarif_racik * multiplier) + (tarif.tarif_embalase * multiplier));

                await PrescriptionRepository.editPrescriptionItem({
                    uuid: item.uuid,
                    biaya_racik: tarif.tarif_racik * multiplier,
                    biaya_embalase: tarif.tarif_embalase * multiplier
                }, transaction);

            } else {
                const hargaItem = await DataMasterItemMedisRepository.getPrice({
                    item_medis_uuid: item.item_medis_uuid,
                    jenis_stok_uuid: item.jenis_stok_uuid
                });

                if (hargaItem === null) {
                    throw new BadRequestException(`harga item medis ${item.item_medis.name} tidak ditemukan`);
                }

                if (konfigurasiHarga.metode_hpp === "avg") {
                    item.dataValues.harga_satuan = hargaItem.detail_harga[0].dataValues.harga_avg;
                } else {
                    item.dataValues.harga_satuan = hargaItem.detail_harga[0].dataValues.harga_terakhir;
                }

                totalHarga += item.harga_satuan * item.medication_qty;

                await PrescriptionRepository.editPrescriptionItem({
                    uuid: item.uuid,
                    harga_satuan: item.harga_satuan,
                }, transaction)
            }
        }

        return totalHarga;
    }
}