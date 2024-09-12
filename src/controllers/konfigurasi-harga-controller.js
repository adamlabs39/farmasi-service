
import successResponse from "../responses/success-response.js";
import KonfigurasiHargaService from "../services/konfigurasi-harga-service.js";

export default class KonfigurasiHargaController {
    static async get(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            const result = await KonfigurasiHargaService.get(req.body);
            res.status(200).json(successResponse("data berhasil didapat", result));
        } catch (error) {
            nextFunction(error);
        }
    }

    static async update(req, res, nextFunction) {
        try {
            req.body.faskes_uuid = res.locals.jwtData.faskesUuid;
            req.body.petugas = res.locals.jwtData.username;
            await KonfigurasiHargaService.update(req.body);
            res.status(200).json(successResponse("data berhasil diupdate"));
        } catch (error) {
            nextFunction(error);
        }
    }
}