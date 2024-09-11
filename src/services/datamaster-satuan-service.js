import ZodValidator from "../validations/zod-validator.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import DataMasterSatuanRepository from "../repositories/datamaster-satuan-repository.js";

export default class DatamasterSatuanService {
    static async create(req) {
        let validData = ZodValidator.validate(DatamasterValidation.CREATE_SATUAN, req);
        return await DataMasterSatuanRepository.create(validData);
    }

    static async getAll(req) {
        let validData = ZodValidator.validate(DatamasterValidation.GET_ALL_SATUAN, req);
        return await DataMasterSatuanRepository.getAll(req);
    }

    static update(req) {
        let validData = ZodValidator.validate(DatamasterValidation.UPDATE_SATUAN, req);
        return DataMasterSatuanRepository.update(validData);
    }

    static delete(req) {
        let validData = ZodValidator.validate(DatamasterValidation.DELETE_SATUAN, req);
        return DataMasterSatuanRepository.delete(validData);
    }
}