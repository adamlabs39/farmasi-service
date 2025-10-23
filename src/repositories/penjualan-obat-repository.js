import Pagination from "../helpers/pagination.js";
import { Op } from "sequelize";
import Utils from "../helpers/utils.js";
import {
  ItemMedisModel,
  ItemPenjualanObatModel,
  JenisStokModel,
  LokasiStokModel,
  PenjualanObatModel,
  SatuanModel,
} from "@adameds/model-sdk/farmasi";

export default class PenjualanObatRepository {
  static async createOtc(req, transaction) {
    return await PenjualanObatModel.create(req, { transaction });
  }

  static async createOtcItem(req, transaction) {
    await ItemPenjualanObatModel.create(req, { transaction });
  }

  static async getAllOtc(req) {
    req.search = Utils.nullToType(req.search);

    const option = {
      where: {
        faskes_uuid: req.faskes_uuid,
        status: req.status,
        [Op.or]: [
          { nama_pembeli: { [Op.iLike]: `%${req.search}%` } },
          { no_transaksi: { [Op.iLike]: `%${req.search}%` } },
        ],
        tanggal_pembelian: {
          [Op.between]: [req.start_date, req.end_date],
        },
      },
      include: [
        {
          model: LokasiStokModel,
          as: "lokasi_stok",
          attributes: ["name"],
          required: !!req.lokasi,
          where: {
            default_tujuan_order_permintaan: {
              [Op.iLike]: `%${req.lokasi || ""}%`,
            },
          },
        },
      ],
    };
    return Pagination.init(PenjualanObatModel, req, option);
  }

  static async updateOtc(req, transaction) {
    const fieldsToUpdate = {};
    if (req.status !== undefined) fieldsToUpdate.status = req.status;
    if (req.alasan_batal !== undefined)
      fieldsToUpdate.alasan_batal = req.alasan_batal;
    if (req.total_item !== undefined)
      fieldsToUpdate.total_item = req.total_item;
    if (req.total_harga !== undefined)
      fieldsToUpdate.total_harga = req.total_harga;

    const [affectedRows] = await PenjualanObatModel.update(fieldsToUpdate, {
      where: { uuid: req.uuid },
      transaction,
    });
    return affectedRows;
  }

  static async getOtcByUuid(req) {
    return await PenjualanObatModel.findOne({
      where: {
        uuid: req.uuid,
      },
      attributes: {
        exclude: [
          "deleted_at",
          "created_at",
          "updated_at",
          "status",
          "faskes_uuid",
          "id",
        ],
      },
      include: [
        {
          model: ItemPenjualanObatModel,
          as: "items",
          attributes: {
            exclude: ["deleted_at", "created_at", "updated_at", "catatan_stok"],
          },
          include: [
            {
              model: JenisStokModel,
              as: "jenis_stok",
              attributes: ["uuid", "name"],
            },
            {
              model: ItemMedisModel,
              as: "item_medis",
              attributes: ["uuid", "name", "satuan_penggunaan_uuid"],
              include: [
                {
                  model: SatuanModel,
                  as: "satuan_penggunaan",
                  attributes: ["name"],
                },
              ],
            },
          ],
        },
        {
          model: LokasiStokModel,
          as: "lokasi_stok",
          attributes: ["uuid", "name"],
        },
      ],
    });
  }

  static async getAllCatatanStok(req) {
    return await ItemPenjualanObatModel.findAll({
      where: {
        penjualan_obat_uuid: req.uuid,
      },
      attributes: ["catatan_stok"],
    });
  }

  static getByCode(req) {
    return PenjualanObatModel.findOne({
      where: {
        no_transaksi: req.no_transaksi,
        faskes_uuid: req.faskes_uuid,
      },
      attributes: ["no_transaksi"],
    });
  }

  static getPendapatan(req) {
    req.search = Utils.nullToType(req.search);

    let option = {
      where: {
        tanggal_pembelian: {
          [Op.between]: [req.start_date, req.end_date],
        },
        status: "lunas",
        faskes_uuid: req.faskes_uuid,
        [Op.or]: [
          { nama_pembeli: { [Op.iLike]: `%${req.search}%` } },
          { no_transaksi: { [Op.iLike]: `%${req.search}%` } },
        ],
      },
      attributes: [
        "no_transaksi",
        "nama_pembeli",
        "total_harga",
        "tanggal_pembelian",
      ],
    };

    return Pagination.init(PenjualanObatModel, req, option);
  }
}
