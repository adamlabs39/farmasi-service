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

  static async updateOtc(dataToUpdate, uuid, transaction) {
    // Terima 3 argumen
    // Hapus data yang tidak perlu di-update
    delete dataToUpdate.uuid;
    delete dataToUpdate.alasan_batal; // Hapus ini jika alasan_batal ada di 'fieldsToUpdate'

    // Gunakan 'dataToUpdate' langsung
    const [affectedRows] = await PenjualanObatModel.update(dataToUpdate, {
      where: { uuid: uuid }, // Gunakan 'uuid' dari argumen terpisah
      transaction,
    });
    return affectedRows;
  }

  static async getOtcByUuid({ uuid }, transaction = null) {
    const includeOptions = [
      {
        model: ItemPenjualanObatModel,
        as: "items",
        attributes: {
          exclude: ["deleted_at", "created_at", "updated_at", "id"],
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
    ];

    if (transaction) {
      // Ambil dan LOCK header-nya dulu
      const penjualanHeader = await PenjualanObatModel.findOne({
        where: { uuid },
        transaction,
        lock: transaction.LOCK.UPDATE,
      });

      if (!penjualanHeader) return null;

      // Ambil relasinya secara terpisah
      const items = await penjualanHeader.getItems({
        attributes: {
          exclude: ["deleted_at", "created_at", "updated_at", "id"],
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
            attributes: ["uuid", "name"],
          },
        ],
        transaction,
      });
      const lokasiStok = await penjualanHeader.getLokasi_stok({ transaction });

      // Gabungkan hasilnya
      const result = penjualanHeader.toJSON();
      result.items = items.map((i) => i.toJSON());
      result.lokasi_stok = lokasiStok ? lokasiStok.toJSON() : null;

      return result;
    } else {
      // Alur normal (tanpa lock)
      return await PenjualanObatModel.findOne({
        where: { uuid: uuid },
        attributes: {
          exclude: ["id", "deleted_at", "created_at", "updated_at"],
        },
        include: includeOptions,
      });
    }
  }

  //   static async getOtcByUuid(req) {
  //     return await PenjualanObatModel.findOne({
  //       where: {
  //         uuid: req.uuid,
  //       },
  //       attributes: {
  //         exclude: [
  //           "deleted_at",
  //           "created_at",
  //           "updated_at",
  //         //   "status",
  //           "faskes_uuid",
  //           "id",
  //         ],
  //       },
  //       include: [
  //         {
  //           model: ItemPenjualanObatModel,
  //           as: "items",
  //           attributes: {
  //             exclude: ["deleted_at", "created_at", "updated_at"],
  //           },
  //           include: [
  //             {
  //               model: JenisStokModel,
  //               as: "jenis_stok",
  //               attributes: ["uuid", "name"],
  //             },
  //             {
  //               model: ItemMedisModel,
  //               as: "item_medis",
  //               attributes: ["uuid", "name", "satuan_penggunaan_uuid"],
  //               include: [
  //                 {
  //                   model: SatuanModel,
  //                   as: "satuan_penggunaan",
  //                   attributes: ["name"],
  //                 },
  //               ],
  //             },
  //           ],
  //         },
  //         {
  //           model: LokasiStokModel,
  //           as: "lokasi_stok",
  //           attributes: ["uuid", "name"],
  //         },
  //       ],
  //     });
  //   }

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
