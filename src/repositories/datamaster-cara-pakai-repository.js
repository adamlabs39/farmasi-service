import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import CaraiPakaiModel from "../models/cara-pakai-model.js";

export default class DataMasterCaraPakaiRepository {
    static async create(req) {
        return await CaraiPakaiModel.create({
            code: req.code,
            cara_pakai: req.cara_pakai,
            status: req.status,
            faskes_uuid : req.faskes_uuid,
        });
    }

    static async getAll(req) {
        const option = {
            where: {
                faskes_uuid : req.faskes_uuid,
                cara_pakai : {[Op.iLike]: `%${req.cara_pakai || ""}%`},
                deleted_at: {
                    [Op.is]: null,
                },
            },
        };

        return Pagination.init(CaraiPakaiModel, req, option);
    }

    static async update(req) {
        return await CaraiPakaiModel.update({
            code: req.code,
            cara_pakai: req.cara_pakai,
            status: req.status,
        }, {
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async delete(req) {
        return await CaraiPakaiModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async getAllWithoutPagination(faskes_uuid) {
        return await CaraiPakaiModel.findAll(
            {
                where: {
                    faskes_uuid: faskes_uuid
                }
            }
        );
    }
}