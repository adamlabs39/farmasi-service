import Pagination from "../helpers/pagination.js";
import { Op } from "sequelize";
import { toEpochDate } from "../helpers/date-helper.js";
import { CaraiPakaiModel } from "@adameds/model-sdk/farmasi";
import NotfoundException from "../errors/notfound-exception.js";

export default class DataMasterCaraPakaiRepository {
  static async create(req) {
    return await CaraiPakaiModel.create({
      code: req.code,
      cara_pakai: req.cara_pakai,
      status: req.status,
      faskes_uuid: req.faskes_uuid,
    });
  }

  static async getAll(req) {
    const option = {
      where: {
        faskes_uuid: req.faskes_uuid,
        cara_pakai: { [Op.iLike]: `%${req.cara_pakai || ""}%` },
        deleted_at: {
          [Op.is]: null,
        },
      },
      order: [["created_at", "DESC"]],
    };

    return Pagination.init(CaraiPakaiModel, req, option);
  }

  static async update(req) {
    const [affectedRow] = await CaraiPakaiModel.update(
      {
        code: req.code,
        cara_pakai: req.cara_pakai,
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
    const [affectedRow] = await CaraiPakaiModel.update(
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

  static async getAllWithoutPagination(faskes_uuid) {
    return await CaraiPakaiModel.findAll({
      where: {
        faskes_uuid: faskes_uuid,
      },
    });
  }

  static async bulkCreate(data) {
    return await CaraiPakaiModel.bulkCreate(data);
  }
}
