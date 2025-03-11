import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import {BentukSediaanModel} from "@adameds/model-sdk/farmasi";
import BadRequestException from "../errors/bad-request-exception.js";

export default class DatamasterBentukSediaanRepository {
    static async create(req) {
        return await BentukSediaanModel.create({
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

        return Pagination.init(BentukSediaanModel, req, option);
    }

    static async update(req) {
        const [affectedRow] =  await BentukSediaanModel.update({
            code: req.code,
            name: req.name,
            status: req.status,
        }, {
            where: {
                uuid: req.uuid,
            }
        });

        if (affectedRow === 0) {
            throw new BadRequestException("Data tidak ditemukan");
        }

        return affectedRow;
    }

    static async delete(req) {
        const [affectedRow] = await BentukSediaanModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });

        if (affectedRow === 0) {
            throw new BadRequestException("Data tidak ditemukan");
        }

        return affectedRow;
    }

    static getUuidesByCode(codes, faskesUuid) {
        return BentukSediaanModel.findAll({
            where: {
                code: {
                    [Op.in]: codes
                },
                faskes_uuid: faskesUuid
            },
            attributes: ['uuid', 'code']
        });
    }

    static bulkCreate(data) {
        return BentukSediaanModel.bulkCreate(data);
    }
}