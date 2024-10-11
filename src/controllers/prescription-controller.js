import successResponse from "../responses/success-response.js";
import PrescriptionService from "../services/prescription-service.js";

export default class PrescriptionController {
    static async orderObat(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.body.dokter_order = res.locals.jwtData.username;
            const result = await PrescriptionService.orderObat(req.body);
            res.status(200).json(successResponse("data berhasil dibuat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async addObat(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            const result = await PrescriptionService.addObat(req.body);
            res.status(200).json(successResponse("data berhasil ditambahkan", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async deleteObat(req, res, nextFunction) {
        try {
            req.body.prescription_uuid = req.params.prescription_uuid;
            const result = await PrescriptionService.deleteObat(req.body);
            res.status(200).json(successResponse("data berhasil dihapus"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getByUuid(req, res, nextFunction) {
        try {
            const result = await PrescriptionService.getByUuid(req.params.uuid);
            res.status(200).json(successResponse("data berhasil ditemukan", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updatePrescription(req, res, nextFunction) {
        try {
            req.body.uuid = req.params.uuid;
            await PrescriptionService.updatePrescription(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateObat(req, res, nextFunction) {
        try {
            req.body.uuid = req.params.uuid;
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            await PrescriptionService.updateObat(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getHistoryObat(req, res, nextFunction){
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.body.no_rm = req.query.no_rm;
            req.body.group_index = (req.query.page ?? 1) - 1;
            req.body.pelayanan = req.query.pelayanan;
            const result = await PrescriptionService.getHistoryObat(req.body);
            res.status(200).json(successResponse("data berhasil ditemukan", result.data, result.metadata));
        } catch (error) {
            nextFunction(error);
        }
    }
}