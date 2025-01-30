import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {
    BentukSediaanModel,
    ConversionModel, HargaItemModel,
    ItemMedisJenisStokModel,
    ItemMedisModel,
    JenisStokModel, KategoriObatModel,
    ManufactureModel, SatuanModel
} from "@adameds/model-sdk/farmasi";
import moment from "moment";
import {StockMedisModel} from "@adameds/model-sdk/inventory";

export default class DataMasterItemMedisRepository {
    static async create(req, transaction) {
        return await ItemMedisModel.create(req, {transaction});
    }

    static async getAll(req) {

        let whereJenisStok = {
            deleted_at: {[Op.is]: null},
        }

        if (req.jenis_stok_uuides !== undefined && req.jenis_stok_uuides.length !== 0){
            whereJenisStok.jenis_stok_uuid ={
                [Op.in] : req.jenis_stok_uuides
            }
        }

        const option = {
            where: {
                faskes_uuid: req.faskes_uuid,
                name: {[Op.iLike]: `%${req.name || ""}%`},
                deleted_at: {
                    [Op.is]: null,
                },
                jenis_item :  {[Op.iLike]: `%${req.jenis_item || ""}%`},
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
                    model: ManufactureModel,
                    as: "manufacture",
                    required: false,
                    where: {deleted_at: {[Op.is]: null}},
                    attributes: [
                        "code", "name"
                    ]
                },
                {
                    model: ItemMedisJenisStokModel,
                    as: "jenis_stok",
                    required: true,
                    where: whereJenisStok,
                    attributes: ["uuid", "jenis_stok_uuid"],
                    include: [
                        {
                            model: JenisStokModel,
                            as: "detail_stok",
                            required: false,
                            where: {deleted_at: {[Op.is]: null}},
                            attributes: ["name", "uuid"]
                        }
                    ]
                },
                {
                    model: SatuanModel,
                    as: "satuan_penggunaan",
                    required: false,
                    where: {deleted_at: {[Op.is]: null}},
                    attributes: ["name"]
                },
                {
                    model: SatuanModel,
                    as: "satuan_dosis",
                    required: false,
                    where: {deleted_at: {[Op.is]: null}},
                    attributes: ["name"]
                },
                {
                    model: SatuanModel,
                    as: "satuan_kemasan",
                    required: false,
                    where: {deleted_at: {[Op.is]: null}},
                    attributes: ["name"]
                },
                {
                    model : KategoriObatModel,
                    as : "kategori_obat",
                    required: false,
                    where: {deleted_at: {[Op.is]: null}},
                    attributes: ["name"]
                },
                {
                    model : BentukSediaanModel,
                    as : "bentuk_sediaan",
                    required: false,
                    where: {deleted_at: {[Op.is]: null}},
                    attributes: ["name"]
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
                deleted_at: moment().unix()
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
                    jenis_item : req.jenis_item
                },
                attributes : ["uuid", "name", "code"],
                include: [
                    {
                        model : SatuanModel,
                        as : 'satuan_penggunaan',
                        required: false,
                        attributes : ['name']
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

    static async getItemMedisJenisStok(req) {
        return await ItemMedisJenisStokModel.findOne({
        where: {
            item_medis_uuid: req.item_medis_uuid,
            jenis_stok_uuid: req.jenis_stok_uuid,
            deleted_at: {
                [Op.is]: null
            },
        },
        include: [
            {
                model: HargaItemModel,
                as: "detail_harga",
                required: true,
                where: {
                    deleted_at: {
                        [Op.is]: null
                    }
                },
                limit: 1,
                order: [['created_at', 'DESC']],
            }
        ]
    });
    }

    static async getAvailableJenisStok(req, isAvg = false){
        return await ItemMedisJenisStokModel.findAll({
            where: {
                item_medis_uuid: req.item_medis_uuid,
                deleted_at: {
                    [Op.is]: null
                },
            },
            attributes : ["uuid"],
            include: [
                {
                    model: JenisStokModel,
                    as: "detail_stok",
                    required: true,
                    attributes : ["uuid", "name"],
                    where: {
                        deleted_at: {
                            [Op.is]: null
                        },
                        status : true
                    },
                },
                {
                    model : StockMedisModel,
                    as : "stocks",
                    required: true,
                    attributes : ["sisa_stok", "exp_date"],
                    where: {
                        deleted_at: {
                            [Op.is]: null
                        },
                        exp_date: {
                            [Op.gt]: new Date()
                        },
                        lokasi_stok_uuid : {[Op.iLike]: `%${req.lokasi_stok_uuid || ""}%`}
                    }

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
                },
            ]
        });
    }

    static async getPrice(req){
        return await ItemMedisJenisStokModel.findOne({
            where: {
                item_medis_uuid: req.item_medis_uuid,
                jenis_stok_uuid: req.jenis_stok_uuid,
                deleted_at: {
                    [Op.is]: null
                },
            },
            include: [
                {
                    model: HargaItemModel,
                    as: "detail_harga",
                    required: true,
                    where: {
                        deleted_at: {
                            [Op.is]: null
                        }
                    },
                    limit: 1,
                    order: [['created_at', 'DESC']],
                }
            ]
            });
    }

    static async bulkCreate(req, transaction){
        return await ItemMedisModel.bulkCreate(req, {transaction});
    }

    static async bulkInsertJenisStok(req, transaction) {
        return await ItemMedisJenisStokModel.bulkCreate(req, {transaction});
    }

    static async getSome(uuidArray){
        return await ItemMedisModel.findAll({
            where: {
                uuid : {
                    [Op.in]: uuidArray,
                }
            },
            include : [
                {
                    model: SatuanModel,
                    as: "satuan_penggunaan",
                    required: false,
                    attributes: ["name"]
                },
            ],
            attributes : ["uuid", "name"],
        });
    }
}