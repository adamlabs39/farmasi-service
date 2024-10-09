import PrescriptionRepository from "../repositories/prescription-repository.js";
import PrescriptionValidation from "../validations/prescription-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import BadRequestException from "../errors/bad-request-exception.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";

export default class PrescriptionService {
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

        try {
            // create prescription
            const prescription = await PrescriptionRepository.createPrescription(req, transaction);
            const prescription_uuid = prescription.dataValues.uuid;

            // create prescription item
            for (const item of req.obat) {
                ZodValidator.validate(PrescriptionValidation.CREATE_PRESCRIPTION_ITEM, item);

                item.prescription_uuid = prescription_uuid;
                item.faskes_uuid = req.faskes_uuid;
                item.sisa_qty_order = item.medication_qty;

                const prescription_item =
                    await PrescriptionRepository.
                    createPrescriptionItem(item, transaction);

                // create prescription item racikan
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

            return {
                prescription : prescription,
                uuid : prescription_uuid
            };
        } catch (e) {
            await transaction.rollback();
            throw e;
        }
    }
}