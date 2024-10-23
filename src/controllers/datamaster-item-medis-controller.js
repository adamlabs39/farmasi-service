import DatamasterItemMedisService from "../services/datamaster-item-medis-service.js";
import successResponse from "../responses/success-response.js";

export default class DatamasterItemMedisController {
    static async create(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            await DatamasterItemMedisService.create(req.body);
            res.status(201).json(successResponse("data berhasil dibuat"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async update(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.body.uuid = req.params.uuid;
            await DatamasterItemMedisService.update(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getAll(req, res, nextFunction) {
        try {
            req.query.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.body.name = req.query.name;
            const result = await DatamasterItemMedisService.getAll(req.query);
            res.status(200).json(successResponse("data berhasil didapat", result.data, result.pagination));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async delete(req, res, nextFunction) {
        try {
            const { uuid } = req.params;
            req.body.uuid = uuid;
            await DatamasterItemMedisService.delete(req.body);
            res.status(200).json(successResponse("data berhasil dihapus"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getConversions(req, res, nextFunction) {
        try {
            req.query.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.query.item_medis_uuid = req.params.uuid;
            const data = await DatamasterItemMedisService.getConversions(req.query);
            res.status(200).json(successResponse(data));
        } catch (error) {
            nextFunction(error);
        }
    }
}