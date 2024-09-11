import successResponse from "../responses/success-response.js";
import DatamasterBentukSediaanService from "../services/datamaster-bentuk-sediaan-service.js";

export default class DatamasterBentukSediaanController {
    static async create(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            await DatamasterBentukSediaanService.create(req.body);
            res.status(201).json(successResponse("data berhasil dibuat"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getAll(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.body.name = req.query.name;
            const result = await DatamasterBentukSediaanService.getAll(req.body);
            res.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async update(req, res, nextFunction) {
        try {
            const { uuid } = req.params;
            req.body.uuid = uuid;
            await DatamasterBentukSediaanService.update(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async delete(req, res, nextFunction) {
        try {
            await DatamasterBentukSediaanService.delete(req.body);
            res.status(200).json(successResponse("data berhasil dihapus"));
        } catch (error) {
            nextFunction(error);
        }
    }
}