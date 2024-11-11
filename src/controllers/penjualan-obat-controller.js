import successResponse from "../responses/success-response.js";
import PenjualanObatService from "../services/penjualan-obat-service.js";

export default class PenjualanObatController {
    static async create(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = req.author.faskesUuid;

            const result = await PenjualanObatService.create(req.body);

            res.status(200).json(successResponse("data berhasil dibuat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async batalOtc(req, res, nextFunction) {
        try {
            const { uuid } = req.params;
            req.body.uuid = uuid;
            const result = await PenjualanObatService.batalOtc(req.body);

            res.status(200).json(successResponse("data berhasil dibatalkan", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getAll(req, res, nextFunction) {
        try {
            req.query.faskes_uuid = req.author.faskesUuid;

            const result = await PenjualanObatService.getAll(req.query);
            res.status(200).json(successResponse("data berhasil didapat", result.data, result.pagination));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getDetail(req, res, nextFunction) {
        try {
            const { uuid } = req.params;
            req.query.uuid = uuid;

            const result = await PenjualanObatService.getByUuid(req.query);
            res.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error) {
            nextFunction(error);
        }
    }
}