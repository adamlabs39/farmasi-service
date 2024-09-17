import DataMasterItemMedisRepository from "../repositories/datamaster-item-medis-repository.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import ConversionRepository from "../repositories/conversion-repository.js";
import {uuidv7} from "uuidv7";

export default class DatamasterItemMedisService {
    static async create(req) {
        ZodValidator.validate(DatamasterValidation.CREATE_ITEM_MEDIS, req);
        const itemMedis = await DataMasterItemMedisRepository.create(req);

        if(req.conversion !== undefined && Array.isArray(req.conversion)){
            const newConversion = req.conversion.filter(item => item.uuid === "").map(item => ({
                ...item,
                item_medis_uuid: itemMedis.dataValues.uuid,
                faskes_uuid: req.faskes_uuid,
                uuid : uuidv7(),
            }));

            if (newConversion.length > 0) {
                await ConversionRepository.bulkCreate(newConversion);
            }
        }

        return itemMedis;
    }

    static async update(req) {
        ZodValidator.validate(DatamasterValidation.UPDATE_ITEM_MEDIS, req);
        const itemMedis = await DataMasterItemMedisRepository.update(req);

        if(req.conversion !== undefined && Array.isArray(req.conversion)){
            const newConversion = req.conversion.filter(item => item.uuid === "").map(item => ({
                ...item,
                item_medis_uuid: req.uuid,
                faskes_uuid: req.faskes_uuid,
                uuid : uuidv7(),
            }));

            const updatedConversion = req.conversion.filter(item => item.is_updated === true).map(item => ({
                ...item,
                item_medis_uuid: req.uuid,
                faskes_uuid: req.faskes_uuid,
            }));

            const deletedConversion = req.conversion.filter(item => item.is_deleted === true).map(item => ({
                ...item,
                item_medis_uuid: req.uuid,
                faskes_uuid: req.faskes_uuid,
            }));

            if (newConversion.length > 0) {
                await ConversionRepository.bulkCreate(newConversion);
            }

            if (updatedConversion.length > 0) {
                await Promise.all(updatedConversion.map(item => ConversionRepository.update(item)));
            }

            if (deletedConversion.length > 0) {
                await Promise.all(deletedConversion.map(item => ConversionRepository.delete(item)));
            }
        }

        return itemMedis;
    }

    static async getAll(req) {
        return await DataMasterItemMedisRepository.getAll(req);
    }

    static async delete(req) {
        ZodValidator.validate(DatamasterValidation.DELETE_SATUAN, req);
        return await DataMasterItemMedisRepository.delete(req);
    }

    static async getConversions(req) {
        ZodValidator.validate(DatamasterValidation.GET_CONVERSIONS, req);
        return await ConversionRepository.getAll(req);
    }
}