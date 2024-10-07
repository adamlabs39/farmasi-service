import SatuanModel from "../models/satuan-model.js";
import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";

export default class DataMasterSatuanRepository {
    static async create(req) {
        return await SatuanModel.create({
            code: req.code,
            name: req.name,
            status: req.status,
            faskes_uuid : req.faskes_uuid,
            satuan_dosis : req.satuan_dosis
        });
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

        return Pagination.init(SatuanModel, req, option);
    }

    static async update(req) {
        return await SatuanModel.update({
            code: req.code,
            name: req.name,
            status: req.status,
            satuan_dosis : req.satuan_dosis
        }, {
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async delete(req) {
        return await SatuanModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async getAllWithoutPagination(faskes_uuid) {
        return await SatuanModel.findAll(
            {
                where: {
                    faskes_uuid: faskes_uuid,
                    satuan_dosis : true,
                }
            }
        );
    }
}