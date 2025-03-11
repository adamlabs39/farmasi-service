import PrescriptionRepository from "../repositories/prescription-repository.js";
import PrescriptionValidation from "../validations/prescription-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import BadRequestException from "../errors/bad-request-exception.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import DataMasterLokasiStokRepository from "../repositories/datamaster-lokasi-stok-repository.js";
import InternalServerException from "../errors/internal-server-exception.js";
import Utils from "../helpers/utils.js";
import axiosInstance from "../configurations/axios-instance.js";
import {INVENTORY_URL, REKAM_MEDIS_URL} from "../helpers/constants.js";
import {setRangeDate, toEpochDate} from "../helpers/date-helper.js";
import KonfigurasiHargaService from "./konfigurasi-harga-service.js";
import StockMedisRepository from "../repositories/stock-medis-repository.js";
import DataMasterItemMedisRepository from "../repositories/datamaster-item-medis-repository.js";
import DataMasterBentukRacikanRepository from "../repositories/datamaster-bentuk-racikan-repository.js";

export default class PrescriptionService {
    static async getByUuid(uuid) {
        const prescription = await PrescriptionRepository.getByUuid(uuid);
        if (prescription === null) {
            throw new BadRequestException("data tidak ditemukan");
        }

        if (prescription.order_status === 1){
            prescription.dataValues.obat.forEach((item) => {
                item.dataValues.jenis_stok_uuid = ""
                item.dataValues.racikan.forEach((racikan) => {
                    racikan.dataValues.jenis_stok_uuid = ""
                })
            })
        }

        prescription.dataValues.is_chronic = false;
        prescription.dataValues.is_compound = false;

        prescription.dataValues.obat.forEach((item) => {
            if (item.is_chronic) {
                prescription.dataValues.is_chronic = true;
            }

            if (item.is_compound) {
                prescription.dataValues.is_compound = true;
            }
        })

        return prescription;
    }

    static async orderObat(req) {
        req.order_status = 1;
        const transaction = await sequelizeInstance.transaction();

        // generate no prescription
        req.no_resep = Utils.generate4Code('RSP');

        // validate input
        ZodValidator.validate(PrescriptionValidation.CREATE_PRESCRIPTION, req);
        if (req.obat === null || req.obat === undefined) {
            throw new BadRequestException("'obat' tidak boleh kosong");
        }

        // get default lokasi stok
        const lokasiStocks = await DataMasterLokasiStokRepository.getAll({
            faskes_uuid: req.faskes_uuid,
            jenis_lokasi: "depo",
            limit: 100
        });

        if (!lokasiStocks) {
            throw new InternalServerException("lokasi stok belum di set");
        }

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
            // create prescription
            const prescription = await PrescriptionRepository.createPrescription(req, transaction);
            const prescription_uuid = prescription.dataValues.uuid;
            prescription.dataValues.obat = [];

            // create prescription item
            for (const item of req.obat) {
                item.prescription_uuid = prescription_uuid;
                item.faskes_uuid = req.faskes_uuid;
                item.sisa_qty_order = item.medication_qty;

                ZodValidator.validate(PrescriptionValidation.CREATE_PRESCRIPTION_ITEM, item);

                const prescription_item =
                    await PrescriptionRepository.createPrescriptionItem(item, transaction);
                prescription.dataValues.obat.push(prescription_item);
                prescription_item.dataValues.racikan = [];

                // create prescription item racikan
                if (item.racikan !== null && item.racikan !== undefined) {
                    for (const racikan of item.racikan) {
                        ZodValidator.validate(PrescriptionValidation.CREATE_PRESCRIPTION_ITEM_RACIKAN, item);

                        racikan.faskes_uuid = req.faskes_uuid;
                        racikan.prescription_item_uuid = prescription_item.dataValues.uuid;

                        const item_racikan = await PrescriptionRepository.createPrescriptionItemRacikan(racikan, transaction);
                        prescription_item.dataValues.racikan.push(item_racikan);
                    }
                }
            }

            // insert into rekam medis
            try {
                await axiosInstance.post(`${REKAM_MEDIS_URL}/rekam-medis/order-obat`, {
                    session_uuid: req.session_uuid,
                    order_obat_uuid: prescription_uuid
                }, {
                    headers: {
                        Authorization: req.token
                    }
                });
            } catch (error) {
                if (error.response) {
                    throw new InternalServerException("[SERVER REKAM MEDIS]: " + error.response.data.message);
                } else if (error.request) {
                    throw new InternalServerException("Tidak ada respons dari server rekam medis");
                } else {
                    throw new InternalServerException("Kesalahan saat menyiapkan permintaan rekam medis");
                }
            }

            await transaction.commit();

            return prescription;
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }

    static async addObat(req) {
        const transaction = await sequelizeInstance.transaction();

        if (req.obat === null || req.obat === undefined) {
            throw new BadRequestException("'obat' tidak boleh kosong");
        }

        try {
            for (const item of req.obat) {
                await this.statusLessThan(req.prescription_uuid, 2);

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

    static async deleteObat(req) {
        ZodValidator.validate(PrescriptionValidation.DELETE_PRESCRIPTION_ITEM, req);

        const item = await PrescriptionRepository.getPrescriptionUuidByObat(req.prescription_item_uuid);
        await this.statusLessThan(item.prescription_uuid, 2);

        const result = await PrescriptionRepository.deletePrescriptionItem(req.prescription_item_uuid);
        if (result === 0) {
            throw new BadRequestException("data tidak ditemukan");
        }
        return result;
    }

    static async updatePrescription(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_PRESCRIPTION, req);

        await this.statusLessThan(req.uuid, 2);

        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateObat(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_OBAT, req);

        const item = await PrescriptionRepository.getPrescriptionUuidByObat(req.uuid);
        await this.statusLessThan(item.prescription_uuid, 2);

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
        ZodValidator.validate(PrescriptionValidation.GET_SOME_ORDER, req);
        const rawData = await PrescriptionRepository.getOrderBySomeUuid(req.uuides);
        let data = [];

        for (const resep of rawData) {
            resep.dataValues.jumlah_obat = resep.dataValues.obat.length;

            resep.dataValues.lokasi_stok = resep.dataValues.lokasi_stok.name;

            for (const obatItem of resep.dataValues.obat) {
                if (obatItem.is_compound) {
                    resep.dataValues.is_racikan = true;
                }

                if (obatItem.is_chronic) {
                    resep.dataValues.is_chronic = true;
                }
            }

            resep.dataValues.obat = undefined;

            data.push(resep.dataValues);
        }

        if (data.length <= 0) {
            throw new BadRequestException("data tidak ditemukan");
        }

        return data;
    }

    static async updateTelaah(req) {
        req.status_telaah = true;
        req.order_status = 2;
        ZodValidator.validate(PrescriptionValidation.UPDATE_TELAAH, req);
        return await PrescriptionRepository.editPrescription(req);
    }

    static async batalOrder(req) {
        req.order_status = 0;
        ZodValidator.validate(PrescriptionValidation.BATAL_ORDER, req);
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateVerifikasi(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_VERIFIKASI, req);

        const transaction = await sequelizeInstance.transaction();

        await this.statusLessThan(req.uuid, 2);

        // get konfigurasi harga
        const konfigurasiHarga = await KonfigurasiHargaService.get(req);

        // get all prescription item
        const prescription = await PrescriptionRepository.getByUuid(req.uuid);

        const mutasiItems = [];

        try {
            req.total_harga = await this.setPriceInPrescription(prescription, konfigurasiHarga, transaction);

            // loop for reduce stock
            for (const obat of prescription.obat) {
                let usedStock;

                if (obat.is_compound) {
                    for (const racikan of obat.racikan) {
                        usedStock = await StockMedisRepository.reduceQuantity({
                            item_medis_uuid: racikan.item_medis_uuid,
                            jenis_stok_uuid: racikan.jenis_stok_uuid,
                            quantity: racikan.medication_qty,
                            metode_pemotongan_stok: konfigurasiHarga.metode_pemotongan_stok,
                            name: racikan.item_medis?.name,
                            lokasi_stok_uuid: prescription.lokasi_stok_uuid
                        }, transaction)

                        for (const stock of usedStock) {
                            mutasiItems.push({
                                item_uuid: racikan.item_medis_uuid,
                                exp_date: stock.expired_date,
                                stok_awal: stock.stock_before,
                                stok_mutasi: stock.stock_before - stock.quantity,
                                jenis_stok_uuid: racikan.item_medis_uuid,
                                lokasi_stok_uuid: prescription.lokasi_stok_uuid,
                                type: "defisit"
                            });
                        }
                    }
                } else {
                    usedStock = await StockMedisRepository.reduceQuantity({
                        item_medis_uuid: obat.item_medis_uuid,
                        jenis_stok_uuid: obat.jenis_stok_uuid,
                        quantity: obat.medication_qty,
                        lokasi_stok_uuid: prescription.lokasi_stok_uuid,
                        metode_pemotongan_stok: konfigurasiHarga.metode_pemotongan_stok,
                        name: obat.item_medis?.name
                    }, transaction)

                    for (const stock of usedStock) {
                        mutasiItems.push({
                            item_uuid: obat.item_medis_uuid,
                            exp_date: stock.expired_date,
                            stok_awal: stock.stock_before,
                            stok_mutasi: stock.stock_before - stock.quantity,
                            jenis_stok_uuid: obat.jenis_stok_uuid,
                            lokasi_stok_uuid: prescription.lokasi_stok_uuid,
                            type: "defisit"
                        });
                    }
                }

                const prescriptionItem = {
                    uuid : obat.uuid,
                    stok_medis_uuides : usedStock
                }

                // update prescription item
                await PrescriptionRepository.editPrescriptionItem(prescriptionItem, transaction)
            }

            // update prescription
            req.order_status = 3;
            req.waktu_verifikasi = toEpochDate(new Date());
            req.no_invoice = Utils.generate4Code("INV");
            await PrescriptionRepository.editPrescription(req, transaction);

            // region UPLOAD TO INVENTORY
            try {

                console.log(mutasiItems);
                await axiosInstance.post(`${INVENTORY_URL}/mutasi`, {
                    sumber_mutasi: "pelayanan",
                    with_check_stock: true,
                    code: prescription.dataValues.no_resep,
                    keterangan: {
                        description: "Resep Dokter",
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
        } catch (e) {
            await transaction.rollback();
            throw e;
        }

        return prescription;
    }

    static async updateSiapDiserahkan(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_SIAP_DISERAHKAN, req);

        await this.statusLessThan(req.uuid, 3);


        req.order_status = 4;
        req.waktu_penyiapan = toEpochDate(new Date());
        return await PrescriptionRepository.editPrescription(req);
    }

    static async batalSiapDiserahkan(req) {
        ZodValidator.validate(PrescriptionValidation.BATAL_DISERAHKAN, req);
        await this.statusLessThan(req.uuid, 5);
        req.order_status = 4;
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateDiserahkan(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_SERAHKAN, req);
        await this.statusLessThan(req.uuid, 5);
        req.order_status = 5;
        req.waktu_pemberian = toEpochDate(new Date());
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateLokasiStok(req) {
        ZodValidator.validate(PrescriptionValidation.UPDATE_LOKASI_STOK, req);
        return await PrescriptionRepository.editPrescription(req);
    }

    static async getAll(req) {
        setRangeDate(req);

        ZodValidator.validate(PrescriptionValidation.GET_ALL, req);
        const rawData = await PrescriptionRepository.getAllPrescription(req);

        let resep_masuk = [];
        let obat_disiapkan = [];
        let penyerahan_obat = [];

        for (const resep of rawData) {
            if (resep.obat){
                for (const obat of resep.obat) {
                    if (obat.is_chronic) {
                        resep.dataValues.is_chronic = true;
                    }

                    if (obat.is_compound) {
                        resep.dataValues.is_compound = true;
                    }

                    resep.dataValues.obat = undefined;
                }
            }

            resep.dataValues.patient = resep.patient?.name ?? "-";

            if (resep.order_status === 1 || resep.order_status === 2) {
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
                if (!tarif){
                    throw new BadRequestException(`tarif racikan tidak ditemukan`);
                }
                let multiplier = 1;

                if (konfigurasiHarga.metode_biaya_racikan === "paket") {
                    multiplier = 1 + Math.floor(item.medication_qty / tarif.jumlah);
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

    static async statusLessThan(uuid, orderStatus){
        if (!uuid){
            throw new BadRequestException("prescription uuid tidak boleh kosong");
        }

        const prescription = await PrescriptionRepository.getByUuid(uuid);
        if(prescription === null){
            throw new BadRequestException("data prescription tidak ditemukan");
        }

        if(prescription.order_status > orderStatus){
            throw new BadRequestException("order status tidak memungkinkan aksi ini");
        }
    }

    static async getForFpo(req){
        ZodValidator.validate(PrescriptionValidation.GET_FOR_FPO, req);
        return await PrescriptionRepository.getForFpo(req);
    }

    static async getEticketData(uuid){
        const prescription = await PrescriptionRepository.getEticketData(uuid);
        if (prescription === null) {
            throw new BadRequestException("data tidak ditemukan");
        }

        const items = [];

        if (prescription.obat){
            prescription.obat.forEach((item) => {
              items.push({
                  nama_faskes : prescription.faskes?.name,
                  no_resep : prescription.no_resep,
                  date : prescription.order_date,
                  nama_pasien : prescription.patient?.name,
                  tanggal_lahir : prescription.patient?.birth_detail?.birth_date,
                  jenis : item.is_compound ? "Racikan" : "Non-Racikan",
                  jumlah_obat : item.medication_qty,
                  nama_obat : item.item_medis.name,
                  satuan : item.is_compound ? item.bentuk_racikan?.nama_bentuk_racikan : item.item_medis?.satuan_penggunaan?.name,
                  aturan_pakai : `${item.aturan_pakai?.frekuensi}x ${item.aturan_pakai?.periode_unit} ${item.aturan_pakai?.periode}`,
                  cara_pakai : item.cara_pakai?.cara_pakai,
                  catatan : item.prescription_notes,
              })
            })

        }

        return items;
    }

    static async getPrintPrescription(uuid) {
        const prescription = await PrescriptionRepository.getForPrescriptionPrint(uuid);
        if (prescription === null) {
            throw new BadRequestException("data tidak ditemukan");
        }
        return prescription;
    }

    static async getForInvoicePrint(uuid) {
        const prescription = await PrescriptionRepository.getForInvoicePrint(uuid);
        if (prescription === null) {
            throw new BadRequestException("data tidak ditemukan");
        }
        return prescription;
    }
}