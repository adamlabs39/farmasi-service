import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import {JenisStokModel} from "@adameds/model-sdk/farmasi";

export default class DataMasterJenisStokRepository {
    static async create(req) {
        return await JenisStokModel.create({
            code: req.code,
            name: req.name,
            status: req.status,
            faskes_uuid : req.faskes_uuid,
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

        return Pagination.init(JenisStokModel, req, option);
    }

    static async update(req) {
        return await JenisStokModel.update({
            code: req.code,
            name: req.name,
            status: req.status,
        }, {
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async delete(req) {
        return await JenisStokModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });
    }
}