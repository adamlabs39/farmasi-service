import ZodValidator from "../validations/zod-validator.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import DataMasterAturanPakaiRepository from "../repositories/datamaster-aturan-pakai-repository.js";

export default class DatamasterAturanPakaiService {
    static async create(req) {
        let validData = ZodValidator.validate(DatamasterValidation.CREATE_ATURAN_PAKAI, req);
        return await DataMasterAturanPakaiRepository.create(validData);
    }

    static async getAll(req) {
        ZodValidator.validate(DatamasterValidation.GET_ALL_SATUAN, req);
        return await DataMasterAturanPakaiRepository.getAll(req);
    }

    static update(req) {
        let validData = ZodValidator.validate(DatamasterValidation.UPDATE_ATURAN_PAKAI, req);
        return DataMasterAturanPakaiRepository.update(validData);
    }

    static delete(req) {
        let validData = ZodValidator.validate(DatamasterValidation.DELETE_SATUAN, req);
        return DataMasterAturanPakaiRepository.delete(validData);
    }
}