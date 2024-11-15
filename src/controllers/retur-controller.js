import successResponse from "../responses/success-response.js";
import ReturService from "../services/retur-service.js";

export default class ReturController {
    static async create(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = req.author.faskesUuid;
            req.body.petugas_retur = req.author.username;

            const result = await ReturService.create(req.body);

            res.status(200).json(successResponse("data berhasil diretur"));
        } catch (error) {
            nextFunction(error);
        }
    }
}