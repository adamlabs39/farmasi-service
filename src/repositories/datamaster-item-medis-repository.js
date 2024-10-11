import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import ItemMedisModel from "../models/item-medis-model.js";
import ManufactureModel from "../models/manufacture-model.js";
import ConversionModel from "../models/conversion-model.js";

export default class DataMasterItemMedisRepository {
    static async create(req) {
        return await ItemMedisModel.create(req);
    }

    static async getAll(req) {
        const option = {
            where: {
                faskes_uuid : req.faskes_uuid,
                name : {[Op.iLike]: `%${req.name || ""}%`},
                deleted_at: {
                    [Op.is]: null,
                },
            },
            include:[
                {
                    model: ConversionModel,
                    as: "conversions",
                    required: false,
                    where: { deleted_at: { [Op.is]: null } },
                    attributes: [
                        "satuan_pembelian", "satuan_penggunaan", "konversi", "uuid"
                    ]
                }
            ]
        };

        return Pagination.init(ItemMedisModel, req, option);
    }

    static async update(req) {
        return await ItemMedisModel.update(req, {
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async delete(req) {
        return await ItemMedisModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async getAllWithoutPagination(faskes_uuid) {
        return await ItemMedisModel.findAll(
            {
                where: {
                    faskes_uuid: faskes_uuid
                }
            }
        );
    }
}