import ZodValidator from "../validations/zod-validator.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import DataMasterLokasiStokRepository from "../repositories/datamaster-lokasi-stok-repository.js";

export default class DatamasterLokasiStokService {
    static async create(req) {
        let validData = ZodValidator.validate(DatamasterValidation.CREATE_LOKASI_STOK, req);
        return await DataMasterLokasiStokRepository.create(validData);
    }

    static async getAll(req) {
        ZodValidator.validate(DatamasterValidation.GET_ALL_SATUAN, req);
        return await DataMasterLokasiStokRepository.getAll(req);
    }

    static update(req) {
        let validData = ZodValidator.validate(DatamasterValidation.UPDATE_LOKASI_STOK, req);
        return DataMasterLokasiStokRepository.update(validData);
    }

    static delete(req) {
        let validData = ZodValidator.validate(DatamasterValidation.DELETE_SATUAN, req);
        return DataMasterLokasiStokRepository.delete(validData);
    }
}