import {toEpochDate} from "../helpers/date-helper.js";
import {ConversionModel} from "@adameds/model-sdk/farmasi";

export default class ConversionRepository {
    static async bulkCreate(req, transaction) {
        return await ConversionModel.bulkCreate(req, {transaction});
    }

    static async getAll(req) {
        return await ConversionModel.findAll({
            where : {
                deleted_at : null,
                faskes_uuid : req.faskes_uuid,
                item_medis_uuid : req.item_medis_uuid
            },
            attributes: {
                exclude: ['created_at', 'updated_at', 'deleted_at']
            }
        })
    }

    static async update(req, transaction) {
        return await ConversionModel.update(req, {
            where: {
                uuid: req.uuid,
            },
            transaction
        });
    }

    static async delete(req, transaction) {
        return await ConversionModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            },
            transaction
        });
    }
}