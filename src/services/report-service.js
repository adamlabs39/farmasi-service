import PrescriptionRepository from "../repositories/prescription-repository.js";
import ZodValidator from "../validations/zod-validator.js";
import PrescriptionValidation from "../validations/prescription-validation.js";
import ReportValidation from "../validations/report-validation.js";

export default class ReportService {
    static async getPendapatan(req){
        ZodValidator.validate(ReportValidation.GET_PENDAPATAN, req);

        return await PrescriptionRepository.getPendapatan(req);
    }
}