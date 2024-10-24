import DataMasterItemMedisRepository from "../repositories/datamaster-item-medis-repository.js";
import DatamasterValidation from "../validations/datamaster-validation.js";
import ZodValidator from "../validations/zod-validator.js";
import ConversionRepository from "../repositories/conversion-repository.js";
import {uuidv7} from "uuidv7";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import InternalServerException from "../errors/internal-server-exception.js";
import KonfigurasiHargaRepository from "../repositories/konfigurasi-harga-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";

export default class DatamasterItemMedisService {
    static async create(req) {
        ZodValidator.validate(DatamasterValidation.CREATE_ITEM_MEDIS, req);

        const tr = await sequelizeInstance.transaction();
        try {
            const itemMedis = await DataMasterItemMedisRepository.create(req, tr);

            if (!!req.jenis_stocks){
                for (const jenisStock of req.jenis_stocks) {
                    ZodValidator.validate(DatamasterValidation.INSERT_JENIS_STOK_ITEM_MEDIS, jenisStock);
                    await DataMasterItemMedisRepository.insertJenisStok({
                        item_medis_uuid: itemMedis.dataValues.uuid,
                        jenis_stok_uuid: jenisStock.jenis_stok_uuid,
                        faskes_uuid: req.faskes_uuid,
                    }, tr);
                }
            }

            if(req.conversion !== undefined && Array.isArray(req.conversion)){
                const newConversion = req.conversion.filter(item => (item.uuid === "" || item.uuid === null || item.uuid === undefined) ).map(item => ({
                    ...item,
                    item_medis_uuid: itemMedis.dataValues.uuid,
                    faskes_uuid: req.faskes_uuid,
                    uuid : uuidv7(),
                }));

                if (newConversion.length > 0) {
                    await ConversionRepository.bulkCreate(newConversion, tr);
                }
            }


            await tr.commit();
            return itemMedis;
        } catch (e) {
            await tr.rollback();
            throw new InternalServerException(e.message);
        }
    }

    static async update(req) {
        ZodValidator.validate(DatamasterValidation.UPDATE_ITEM_MEDIS, req);
        const tr = await sequelizeInstance.transaction();

        try {
            const itemMedis = await DataMasterItemMedisRepository.update(req, tr);

            if (!!req.jenis_stocks){
                for (const jenisStock of req.jenis_stocks) {

                    if (jenisStock.uuid === null || jenisStock.uuid === undefined){
                        ZodValidator.validate(DatamasterValidation.INSERT_JENIS_STOK_ITEM_MEDIS, jenisStock);
                        await DataMasterItemMedisRepository.insertJenisStok({
                            item_medis_uuid: req.uuid,
                            jenis_stok_uuid: jenisStock.jenis_stok_uuid,
                            faskes_uuid: req.faskes_uuid,
                        }, tr);
                    } else if(!!jenisStock.is_updated){
                        ZodValidator.validate(DatamasterValidation.UPDATE_JENIS_STOK_ITEM_MEDIS, jenisStock);
                        await DataMasterItemMedisRepository.updateJenisStok({
                            jenis_stok_uuid: jenisStock.jenis_stok_uuid,
                            uuid: jenisStock.uuid,
                        }, tr);
                    } else if (!!jenisStock.is_deleted){
                        ZodValidator.validate(DatamasterValidation.DELETE_JENIS_STOK_ITEM_MEDIS, jenisStock);
                        await DataMasterItemMedisRepository.deleteJenisStok({
                            uuid: jenisStock.uuid,
                        }, tr);
                    }
                }
            }

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
                    await ConversionRepository.bulkCreate(newConversion, tr);
                }

                if (updatedConversion.length > 0) {
                    await Promise.all(updatedConversion.map(item => ConversionRepository.update(item, tr)));
                }

                if (deletedConversion.length > 0) {
                    await Promise.all(deletedConversion.map(item => ConversionRepository.delete(item, tr)));
                }
            }

            await tr.commit();
            return itemMedis;
        } catch (e) {
            await tr.rollback();
            throw new InternalServerException(e.message);
        }
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

    static async getAllWithoutPagination(req) {
        const configInfo = await KonfigurasiHargaRepository.get(req.faskes_uuid);

        return await DataMasterItemMedisRepository.getAllWithoutPagination(req, configInfo.metode_hpp === "avg");
    }
}