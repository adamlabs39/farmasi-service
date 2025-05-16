import Pagination from "../helpers/pagination.js";
import { Op } from "sequelize";
import { toEpochDate } from "../helpers/date-helper.js";
import { IngredientModel } from "@adameds/model-sdk/farmasi";
import NotfoundException from "../errors/notfound-exception.js";

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
        name: { [Op.iLike]: `%${req.name || ""}%` },
        deleted_at: {
          [Op.is]: null,
        },
      },
      order: [["created_at", "DESC"]],
    };

    return Pagination.init(IngredientModel, req, option);
  }

  static async update(req) {
    const [affectedRow] = await IngredientModel.update(
      {
        code: req.code,
        name: req.name,
        status: req.status,
      },
      {
        where: {
          uuid: req.uuid,
        },
      }
    );

    if (affectedRow === 0) {
      throw new NotfoundException("Data gagal diedit");
    }

    return affectedRow;
  }

  static async delete(req) {
    const [affectedRow] = await IngredientModel.update(
      {
        deleted_at: toEpochDate(new Date()),
      },
      {
        where: {
          uuid: req.uuid,
        },
      }
    );

    if (affectedRow === 0) {
      throw new NotfoundException("Data gagal dihapus");
    }

    return affectedRow;
  }

  static async bulkCreate(req) {
    return await IngredientModel.bulkCreate(req);
  }
}
