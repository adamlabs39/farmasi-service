import sequelizeInstance from "../configurations/sequelize-instance.js";
import ZodValidator from "../validations/zod-validator.js";
import ReturValidation from "../validations/retur-validation.js";
import ReturRepository from "../repositories/retur-repository.js";
import PrescriptionRepository from "../repositories/prescription-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";
import OrderAlkesRepository from "../repositories/alkes-repository.js";
import {uuidv7} from "uuidv7";
import PrescriptionValidation from "../validations/prescription-validation.js";
import AlkesRepository from "../repositories/alkes-repository.js";
import StockMedisRepository from "../repositories/stock-medis-repository.js";

export default class ReturService {
    static async create(req) {
        ZodValidator.validate(ReturValidation.CREATE, req);

        const retur_uuid = uuidv7();

        if (req.jenis_retur === "obat") {
            const prescription = await PrescriptionRepository.getByUuid(req.prescription_uuid);
            if (!prescription) {
                throw new BadRequestException("Prescription not found");
            }

            if (prescription.order_status !== 5) {
                throw new BadRequestException("Order can't returned because its status");
            }

            req.no_resep = prescription.no_resep;
            req.no_reg = prescription.no_reg;
            req.rekam_medis_uuid = prescription.rekam_medis_uuid;
            req.patient_uuid = prescription.patient_uuid;
            req.no_rm = prescription.no_rm;
            req.order_date = prescription.order_date;
            req.lokasi_stok_uuid = prescription.lokasi_stok_uuid;
        } else if (req.jenis_retur === "alkes") {
            const alkes = await OrderAlkesRepository.getByUuid(req.order_alkes_uuid);
            if (!alkes) {
                throw new BadRequestException("Order Alkes not found");
            }

            if (alkes.order_status !== 4) {
                throw new BadRequestException("Order can't returned its status");
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

                // get prescription item
                const prescriptionItem = await PrescriptionRepository.getPrescriptionByUuid(item.prescription_item_uuid);

                // bring back stock
                if (!prescriptionItem.stok_medis_uuides) {
                    throw new BadRequestException("Stock medis uuides not found");
                }

                for (const stock of prescriptionItem.stok_medis_uuides) {
                    await StockMedisRepository.addQuantity({
                        stock_medis_uuid: stock.stock_medis_uuid,
                        quantity: stock.quantity,
                    }, transaction)
                }

            }

            // update status
            if (req.jenis_retur === "obat") {
                await PrescriptionRepository.editPrescription({
                    uuid: req.prescription_uuid,
                    order_status : 6
                }, transaction)
            } else if (req.jenis_retur === "alkes") {
                await OrderAlkesRepository.editAlkes({
                    uuid: req.order_alkes_uuid,
                    order_status : 5
                }, transaction)
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

    static async getDetail(req) {
        ZodValidator.validate(ReturValidation.GET_DETAIL, req);

        if (req.item_type === "obat") {
            return await ReturRepository.getObatDetail(req);
        } else if (req.item_type === "alkes") {
            return await ReturRepository.getAlkesDetail(req);
        }
    }

    static async getAll(req) {
        ZodValidator.validate(ReturValidation.GET_ALL, req);

        let result;
        req.pagination = true;
        req.subQuery = false;

        if (req.item_type === "obat") {
            req.status = [5, 5]
            ZodValidator.validate(PrescriptionValidation.GET_ALL, req);
            result = await PrescriptionRepository.getAllPrescription(req);
        } else if (req.item_type === "alkes") {
            req.status = [4, 4]
            ZodValidator.validate(PrescriptionValidation.GET_ALL, req);
            result = await AlkesRepository.getAllForFarmacy(req);
        }

        if (!result) {
            throw new BadRequestException("Data not found");
        }

        return result;
    }
}