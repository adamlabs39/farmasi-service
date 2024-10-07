import PrescriptionModel from "../models/prescription-model.js";
import PrescriptionRepository from "../repositories/prescription-repository.js";

export default class PrescriptionService {
    static async createPrescription(req) {
        req.order_status = 1;

        // generate no prescription

        const prescription = await PrescriptionRepository.create(req);

    }
}