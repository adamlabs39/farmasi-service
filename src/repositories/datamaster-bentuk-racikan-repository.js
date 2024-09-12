import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import BentukRacikanModel from "../models/bentuk-racikan-model.js";

export default class DataMasterBentukRacikanRepository {
    static async create(req) {
        return await BentukRacikanModel.create(req);
    }

    static async getAll(req) {
        const option = {
            where: {
                faskes_uuid : req.faskes_uuid,
                nama_bentuk_racikan : {[Op.iLike]: `%${req.nama_bentuk_racikan || ""}%`},
                deleted_at: {
                    [Op.is]: null,
                },
            },
        };

        return Pagination.init(BentukRacikanModel, req, option);
    }

    static async update(req) {
        return await BentukRacikanModel.update(req, {
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async delete(req) {
        return await BentukRacikanModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });
    }
}