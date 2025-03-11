import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import {IngredientModel} from "@adameds/model-sdk/farmasi";
import BadRequestException from "../errors/bad-request-exception.js";

export default class DataMasterIngredientRepository {
    static async create(req) {
        return await IngredientModel.create({
            code: req.code,
            name: req.name,
            status: req.status,
        });
    }

    static async getAll(req) {
        const option = {
            where: {
                name : {[Op.iLike]: `%${req.name || ""}%`},
                deleted_at: {
                    [Op.is]: null,
                },
            },
        };

        return Pagination.init(IngredientModel, req, option);
    }

    static async update(req) {
        const [affectedRow] =  await IngredientModel.update({
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
        const [affectedRow] = await IngredientModel.update({
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

    static async bulkCreate(req) {
        return await IngredientModel.bulkCreate(req);
    }
}