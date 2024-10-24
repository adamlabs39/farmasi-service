import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import ItemMedisModel from "../models/item-medis-model.js";
import ConversionModel from "../models/conversion-model.js";
import ItemMedisJenisStokModel from "../models/item-medis-jenis-stok-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import JenisStokModel from "../models/jenis-stok-model.js";
import HargaItemModel from "../models/harga-item-model.js";

export default class DataMasterItemMedisRepository {
    static async create(req, transaction) {
        return await ItemMedisModel.create(req, {transaction});
    }

    static async getAll(req) {
        const option = {
            where: {
                faskes_uuid: req.faskes_uuid,
                name: {[Op.iLike]: `%${req.name || ""}%`},
                deleted_at: {
                    [Op.is]: null,
                },
            },
            include: [
                {
                    model: ConversionModel,
                    as: "conversions",
                    required: false,
                    where: {deleted_at: {[Op.is]: null}},
                    attributes: [
                        "satuan_pembelian", "satuan_penggunaan", "konversi", "uuid"
                    ]
                },
                {
                    model: ItemMedisJenisStokModel,
                    as: "jenis_stok",
                    required: false,
                    where: {deleted_at: {[Op.is]: null}},
                    attributes: ["uuid"],
                    include: [
                        {
                            model: JenisStokModel,
                            as: "detail_stok",
                            required: false,
                            where: {deleted_at: {[Op.is]: null}},
                            attributes: ["name", "uuid"]
                        }
                    ]
                    // attributes: [
                    //     "satuan_pembelian", "satuan_penggunaan", "konversi", "uuid"
                    // ]
                }
            ]
        };

        return Pagination.init(ItemMedisModel, req, option);
    }

    static async update(req, transaction) {
        return await ItemMedisModel.update(req, {
            where: {
                uuid: req.uuid,
            },
            transaction
        });
    }

    static async delete(req) {
        return await sequelizeInstance.transaction(async tr => {

            await ItemMedisJenisStokModel.update({
                deleted_at: toEpochDate(new Date())
            }, {
                where: {
                    item_medis_uuid: req.uuid,
                },
                tr
            });

            return await ItemMedisModel.update({
                deleted_at: toEpochDate(new Date())
            }, {
                where: {
                    uuid: req.uuid,
                },
                tr
            });
        })
    }

    static async getAllWithoutPagination(req, isAvg = false) {

        return await ItemMedisModel.findAll(
            {
                where: {
                    faskes_uuid: req.faskes_uuid,
                    deleted_at: {
                        [Op.is]: null,
                    },
                },
                attributes : ["uuid", "name", "code"],
                include: [
                    {
                        model: ItemMedisJenisStokModel,
                        as: "jenis_stok",
                        required: false,
                        where: {deleted_at: {[Op.is]: null}},
                        attributes: ["uuid"],
                        include: [
                            {
                                model: JenisStokModel,
                                as: "detail_stok",
                                required: false,
                                where: {deleted_at: {[Op.is]: null}},
                                attributes: ["name", "uuid"]
                            },
                            {
                                model: HargaItemModel,
                                as: "detail_harga",
                                required: false,
                                limit: 1,
                                order: [['created_at', 'DESC']],
                                where: {deleted_at: {[Op.is]: null}},
                                attributes: [
                                    [
                                        sequelizeInstance.literal(`CASE WHEN ${isAvg} THEN harga_avg ELSE harga_terakhir END`),
                                        'harga'
                                    ]
                                ],
                            }
                        ]
                    }
                ]
            }
        );
    }

    static async insertJenisStok(req, transaction) {
        return await ItemMedisJenisStokModel.create(req, {transaction});
    }

    static async updateJenisStok(req, transaction) {
        return ItemMedisJenisStokModel.update(req, {
            where: {
                uuid: req.uuid,
            },
            transaction
        });
    }

    static async deleteJenisStok(req, transaction) {
        return await ItemMedisJenisStokModel.update({
            deleted_at: toEpochDate(new Date())
        }, {
            where: {
                uuid: req.uuid,
            },
            transaction
        });
    }
}