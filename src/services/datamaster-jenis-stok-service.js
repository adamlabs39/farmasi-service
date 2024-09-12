import ZodValidator from "../validations/zod-validator.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import DataMasterJenisStokRepository from "../repositories/datamaster-jenis-stok-repository.js";

export default class DatamasterJenisStokService {
    static async create(req) {
        let validData = ZodValidator.validate(DatamasterValidation.CREATE_SATUAN, req);
        return await DataMasterJenisStokRepository.create(validData);
    }

    static async getAll(req) {
        let validData = ZodValidator.validate(DatamasterValidation.GET_ALL_SATUAN, req);
        return await DataMasterJenisStokRepository.getAll(req);
    }

    static update(req) {
        let validData = ZodValidator.validate(DatamasterValidation.UPDATE_SATUAN, req);
        return DataMasterJenisStokRepository.update(validData);
    }

    static delete(req) {
        let validData = ZodValidator.validate(DatamasterValidation.DELETE_SATUAN, req);
        return DataMasterJenisStokRepository.delete(validData);
    }
}