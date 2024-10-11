import PrescriptionRepository from "../repositories/prescription-repository.js";
import PrescriptionValidation from "../validations/prescription-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import BadRequestException from "../errors/bad-request-exception.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import DataMasterLokasiStokRepository from "../repositories/datamaster-lokasi-stok-repository.js";
import InternalServerException from "../errors/internal-server-exception.js";
import Utils from "../helpers/utils.js";

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
}