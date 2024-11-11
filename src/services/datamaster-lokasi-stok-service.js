import ZodValidator from "../validations/zod-validator.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import DataMasterLokasiStokRepository from "../repositories/datamaster-lokasi-stok-repository.js";

export default class DatamasterLokasiStokService {
    static async create(req) {
        let validData = ZodValidator.validate(DatamasterValidation.CREATE_LOKASI_STOK, req);
        if (req.jenis_lokasi === "depo") {
            req.default_tujuan_order_permintaan = req.default_tujuan_order_permintaan.join("");
        }
        console.log(req);
        return await DataMasterLokasiStokRepository.create(req);
    }

    static async getAll(req) {
        ZodValidator.validate(DatamasterValidation.GET_ALL_SATUAN, req);
        const result = await DataMasterLokasiStokRepository.getAll(req);
        for (let i = 0; i < result.data.length; i++) {
            result.data[i].default_tujuan_order_permintaan = result.data[i].default_tujuan_order_permintaan.split("");
        }
        return result;
    }

    static update(req) {
        let validData = ZodValidator.validate(DatamasterValidation.UPDATE_LOKASI_STOK, req);
        if (req.jenis_lokasi === "depo") {
            req.default_tujuan_order_permintaan = req.default_tujuan_order_permintaan.join("");
        }
        return DataMasterLokasiStokRepository.update(req);
    }

    static delete(req) {
        let validData = ZodValidator.validate(DatamasterValidation.DELETE_SATUAN, req);
        return DataMasterLokasiStokRepository.delete(validData);
    }
}