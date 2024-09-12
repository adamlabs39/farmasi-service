import ZodValidator from "../validations/zod-validator.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import DataMasterCaraPakaiRepository from "../repositories/datamaster-cara-pakai-repository.js";

export default class DatamasterCaraPakaiService {
    static async create(req) {
        let validData = ZodValidator.validate(DatamasterValidation.CREATE_CARA_PAKAI, req);
        return await DataMasterCaraPakaiRepository.create(validData);
    }

    static async getAll(req) {
        ZodValidator.validate(DatamasterValidation.GET_ALL_SATUAN, req);
        return await DataMasterCaraPakaiRepository.getAll(req);
    }

    static update(req) {
        let validData = ZodValidator.validate(DatamasterValidation.UPDATE_CARA_PAKAI, req);
        return DataMasterCaraPakaiRepository.update(validData);
    }

    static delete(req) {
        let validData = ZodValidator.validate(DatamasterValidation.DELETE_SATUAN, req);
        return DataMasterCaraPakaiRepository.delete(validData);
    }
}