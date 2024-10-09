import successResponse from "../responses/success-response.js";
import PrescriptionService from "../services/prescription-service.js";

export default class PrescriptionController {
    static async orderObat(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.body.dokter_order = res.locals.jwtData.username;
            const result = await PrescriptionService.orderObat(req.body);
            res.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error) {
            nextFunction(error);
        }
    }
}