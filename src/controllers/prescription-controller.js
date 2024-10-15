import successResponse from "../responses/success-response.js";
import PrescriptionService from "../services/prescription-service.js";

export default class PrescriptionController {
    static async orderObat(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.body.dokter_order = res.locals.jwtData.username;
            req.body.token = req.get("Authorization");

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
            await PrescriptionService.deleteObat(req.body);
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

    static async getOrderBySomeUuid(req, res, nextFunction){
        try {
            const result = await PrescriptionService.getOrderBySomeUuid(req.body);
            res.status(200).json(successResponse("data berhasil ditemukan", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateTelaah(req, res, nextFunction){
        try {
            await PrescriptionService.updateTelaah(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async batalOrder(req, res, nextFunction){
        try {
            req.body.petugas_pembatalan = res.locals.jwtData.username;
            await PrescriptionService.batalOrder(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateVerifikasi(req, res, nextFunction){
        try {
            req.body.petugas_verifikasi = res.locals.jwtData.username;
            await PrescriptionService.updateVerifikasi(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateSiapDiserahkan(req, res, nextFunction){
        try {
            req.body.petugas_penyiapan_obat = res.locals.jwtData.username;
            await PrescriptionService.updateSiapDiserahkan(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateDiserahkan(req, res, nextFunction){
        try {
            req.body.petugas_pemberi = res.locals.jwtData.username;
            await PrescriptionService.updateDiserahkan(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async batalSiapDiserahkan(req, res, nextFunction){
        try {
            await PrescriptionService.batalSiapDiserahkan(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateLokasiStok(req, res, nextFunction){
        try {
            await PrescriptionService.updateLokasiStok(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async getAll(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            const result = await PrescriptionService.getAll(req.body);
            res.status(200).json(successResponse("data berhasil diupdate", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async updateJenisStokItem(req, res, nextFunction){
        try {
            req.body.uuid = req.params.uuid;
            await PrescriptionService.updateJenisItem(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }
}