import successResponse from "../responses/success-response.js";
import DatamasterLokasiStokService from "../services/datamaster-lokasi-stok-service.js";
import BadRequestException from "../errors/bad-request-exception.js";
import * as XLSX from "xlsx";
import DatamasterSatuanService from "../services/datamaster-satuan-service.js";
import Utils from "../helpers/utils.js";

export default class DatamasterLokasiStokController {
    static async create(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = req.author.faskesUuid;
            await DatamasterLokasiStokService.create(req.body);
            res.status(201).json(successResponse("data berhasil dibuat"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getAll(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = req.author.faskesUuid;
            req.body.name = req.query.name;
            req.body.jenis_lokasi = req.query.jenis_lokasi;
            req.body.kode_tujuan = req.query.kode_tujuan;
            const result = await DatamasterLokasiStokService.getAll(req.body);
            res.status(200).json(successResponse("data berhasil didapat", result.data, result.pagination));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async update(req, res, nextFunction) {
        try {
            const { uuid } = req.params;
            req.body.uuid = uuid;
            await DatamasterLokasiStokService.update(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async delete(req, res, nextFunction) {
        try {
            const { uuid } = req.params;
            req.body.uuid = uuid;
            await DatamasterLokasiStokService.delete(req.body);
            res.status(200).json(successResponse("data berhasil dihapus"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async import(req, res, nextFunction) {
        try {
            req.body.data = Utils.parseExcelToJSON(req);
            req.body.faskes_uuid = req.author.faskesUuid;

            const result = await DatamasterLokasiStokService.import(req.body);

            res.status(200).json(successResponse("data berhasil diimport", result));
        } catch (error) {
            nextFunction(error);
        }
    }
}