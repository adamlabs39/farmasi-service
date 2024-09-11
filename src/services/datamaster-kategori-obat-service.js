import ZodValidator from "../validations/zod-validator.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import DataMasterKategoriObatRepository from "../repositories/datamaster-kategori-obat-repository.js";

export default class DatamasterKategoriObatService {
    static async create(req) {
        let validData = ZodValidator.validate(DatamasterValidation.CREATE_SATUAN, req);
        return await DataMasterKategoriObatRepository.create(validData);
    }

    static async getAll(req) {
        let validData = ZodValidator.validate(DatamasterValidation.GET_ALL_SATUAN, req);
        return await DataMasterKategoriObatRepository.getAll(req);
    }

    static update(req) {
        let validData = ZodValidator.validate(DatamasterValidation.UPDATE_SATUAN, req);
        return DataMasterKategoriObatRepository.update(validData);
    }

    static delete(req) {
        let validData = ZodValidator.validate(DatamasterValidation.DELETE_SATUAN, req);
        return DataMasterKategoriObatRepository.delete(validData);
    }
}