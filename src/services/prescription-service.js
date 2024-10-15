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

export default class PrescriptionService {
    static async getByUuid(uuid) {
        const prescription = await PrescriptionRepository.getByUuid(uuid);
        if (prescription === null) {
            throw new BadRequestException("data tidak ditemukan");
        }
        return prescription;
    }

    static async orderObat(req) {
        req.order_status = 1;
        const transaction = await sequelizeInstance.transaction();

        // generate no prescription
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
        let prescriptionNumber = 'RSP';
        const charactersLength = characters.length;
        for (let i = 0; i < 4; i++) {
            prescriptionNumber += characters.charAt(Math.floor(Math.random() * charactersLength));
        }
        req.no_resep = prescriptionNumber;

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
            await axiosInstance.post(`${REKAM_MEDIS_URL}/rekam-medis/order-obat`, {
                session_uuid: req.session_uuid,
                order_obat_uuid: prescription_uuid
            }, {
                headers: {
                    Authorization: req.token
                }
            });

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

    static async updateObat(req) {
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

    static async getHistoryObat(req){
        return await PrescriptionRepository.getHistoryObat(req);
    }

    static async getOrderBySomeUuid(req){
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

                if (obatItem.is_chronic){
                    resep.dataValues.is_chronic = true;
                }
            }

            resep.dataValues.obat = undefined;

            data.push(resep.dataValues);
        }

        return data;
    }

    static async updateTelaah(req){
        ZodValidator.validate(PrescriptionValidation.UPDATE_TELAAH, req);
        return await PrescriptionRepository.editPrescription(req);
    }

    static async batalOrder(req){
        ZodValidator.validate(PrescriptionValidation.BATAL_ORDER, req);
        req.order_status = 1;
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateVerifikasi(req){
        ZodValidator.validate(PrescriptionValidation.UPDATE_VERIFIKASI, req);
        req.order_status = 3;
        req.waktu_verifikasi = toEpochDate(new Date());
        return await PrescriptionRepository.editPrescription(req);
    }

    static async updateSiapDiserahkan(req){
        ZodValidator.validate(PrescriptionValidation.UPDATE_SIAP_DISERAHKAN, req);
        req.order_status = 4;
        req.waktu_penyiapan = toEpochDate(new Date());
        return await PrescriptionRepository.editPrescription(req);
    }

    static async batalSiapDiserahkan(req){
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
}