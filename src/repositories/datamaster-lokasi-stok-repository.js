import Pagination from "../helpers/pagination.js";
import { Op } from "sequelize";
import { toEpochDate } from "../helpers/date-helper.js";
import { LokasiStokModel } from "@adameds/model-sdk/farmasi";
import NotfoundException from "../errors/notfound-exception.js";

export default class DataMasterLokasiStokRepository {
  static async create(req) {
    return await LokasiStokModel.create({
      code: req.code,
      name: req.name,
      status: req.status,
      jenis_lokasi: req.jenis_lokasi,
      default_tujuan_order_permintaan: req.default_tujuan_order_permintaan,
      faskes_uuid: req.faskes_uuid,
    });
  }

  static async getAll(req) {
    const option = {
      where: {
        faskes_uuid: req.faskes_uuid,
        name: { [Op.iLike]: `%${req.name || ""}%` },
        // default_tujuan_order_permintaan: {
        //   [Op.iLike]: `%${req.kode_tujuan || ""}%`,
        // },
        deleted_at: {
          [Op.is]: null,
        },
      },
      order: [["created_at", "DESC"]],
    };

    // if (req.jenis_lokasi) {
    //   option.where.jenis_lokasi = req.jenis_lokasi;
    // }

    return Pagination.init(LokasiStokModel, req, option);
  }

  static async update(req) {
    const [affectedRow] = await LokasiStokModel.update(
      {
        code: req.code,
        name: req.name,
        status: req.status,
        jenis_lokasi: req.jenis_lokasi,
        default_tujuan_order_permintaan: req.default_tujuan_order_permintaan,
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
    const [affectedRow] = await LokasiStokModel.update(
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

  static async bulkCreate(data) {
    return await LokasiStokModel.bulkCreate(data);
  }
}
