import successResponse from "../responses/success-response.js";
import DatamasterKategoriObatService from "../services/datamaster-kategori-obat-service.js";

export default class DatamasterKategoriObatController {
    static async create(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = req.author.faskesUuid;
            await DatamasterKategoriObatService.create(req.body);
            res.status(201).json(successResponse("data berhasil dibuat"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getAll(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = req.author.faskesUuid;
            req.body.name = req.query.name;
            const result = await DatamasterKategoriObatService.getAll(req.body);
            res.status(200).json(successResponse("data berhasil didapat", result.data, result.pagination));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async update(req, res, nextFunction) {
        try {
            const { uuid } = req.params;
            req.body.uuid = uuid;
            await DatamasterKategoriObatService.update(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async delete(req, res, nextFunction) {
        try {
            const { uuid } = req.params;
            req.body.uuid = uuid;
            await DatamasterKategoriObatService.delete(req.body);
            res.status(200).json(successResponse("data berhasil dihapus"));
        } catch (error) {
            nextFunction(error);
        }
    }
}