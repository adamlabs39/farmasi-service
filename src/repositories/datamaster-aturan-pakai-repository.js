import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import {AturanPakaiModel} from "@adameds/model-sdk/farmasi";

export default class DataMasterAturanPakaiRepository {
    static async create(req) {
        return await AturanPakaiModel.create(req);
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
        };

        return Pagination.init(AturanPakaiModel, req, option);
    }

    static async update(req) {
        return await AturanPakaiModel.update(req, {
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async delete(req) {
        return await AturanPakaiModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async getAllWithoutPagination(faskes_uuid) {
        return await AturanPakaiModel.findAll(
            {
                where: {
                    faskes_uuid: faskes_uuid
                }
            }
        );
    }

    static bulkCreate(req) {
        return AturanPakaiModel.bulkCreate(req);
    }
}