import sequelizeInstance from "../configurations/sequelize-instance.js";
import ZodValidator from "../validations/zod-validator.js";
import ReturValidation from "../validations/retur-validation.js";
import ReturRepository from "../repositories/retur-repository.js";
import PrescriptionRepository from "../repositories/prescription-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";
import OrderAlkesRepository from "../repositories/alkes-repository.js";
import {uuidv7} from "uuidv7";

export default class ReturService {
    static async create(req) {
        ZodValidator.validate(ReturValidation.CREATE, req);

        const retur_uuid = uuidv7();

        if (req.jenis_retur === "obat") {
            const prescription = await PrescriptionRepository.getByUuid(req.prescription_uuid);
            if (!prescription) {
                throw new BadRequestException("Prescription not found");
            }

            req.no_resep = prescription.no_resep;
            req.no_reg = prescription.no_reg;
            req.rekam_medis_uuid = prescription.rekam_medis_uuid;
            req.patient_uuid = prescription.patient_uuid;
            req.no_rm = prescription.no_rm;
            req.order_date = prescription.order_date;
            req.lokasi_stok_uuid = prescription.lokasi_stok_uuid;
        }
        else if (req.jenis_retur === "alkes") {
            const alkes = await OrderAlkesRepository.getByUuid(req.order_alkes_uuid);
            if (!alkes) {
                throw new BadRequestException("Order Alkes not found");
            }

            req.no_order_alkes = alkes.no_order_alkes;
            req.no_reg = alkes.no_reg;
            req.rekam_medis_uuid = alkes.rekam_medis_uuid;
            req.patient_uuid = alkes.patient_uuid;
            req.no_rm = alkes.no_rm;
            req.order_date = alkes.waktu_verifikasi;
            req.lokasi_stok_uuid = alkes.lokasi_stok_uuid;
        }

        const transaction = await sequelizeInstance.transaction();

        try {
            let total = 0;

            for (const item of req.items) {
                item.faskes_uuid = req.faskes_uuid;
                item.retur_uuid = retur_uuid;

                total += (item.harga_satuan * item.qty_retur);

                ZodValidator.validate(ReturValidation.CREATE_ITEM, item);

                await ReturRepository.createItem(item, transaction);
            }

            req.uuid = retur_uuid;
            req.total = total;
            const retur = await ReturRepository.create(req, transaction);

            await transaction.commit();
            return retur;
        } catch (e) {
            await transaction.rollback();
            throw e;
        }

    }
}