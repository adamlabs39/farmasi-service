
import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import Utils from "../helpers/utils.js";
import {
    ItemMedisModel,
    ItemPenjualanObatModel,
    JenisStokModel,
    LokasiStokModel,
    PenjualanObatModel, SatuanModel
} from "@adameds/model-sdk/farmasi";

export default class PenjualanObatRepository {
    static async createOtc(req,transaction){
        return await PenjualanObatModel.create(req, {transaction});
    }

    static async createOtcItem(req, transaction){
        await ItemPenjualanObatModel.create(req, {transaction});
    }

    static async getAllOtc(req){
        req.search = Utils.nullToType(req.search)

        const option = {
            where : {
                faskes_uuid : req.faskes_uuid,
                status : req.status,
                [Op.or]: [
                    { nama_pembeli: { [Op.iLike]: `%${req.search}%` } },
                    { no_transaksi: { [Op.iLike]: `%${req.search}%` } }
                ],
                tanggal_pembelian : {
                    [Op.between]: [req.start_date, req.end_date]
                },
            },
            include : [
                {
                    model : LokasiStokModel,
                    as : "lokasi_stok",
                    attributes : ["name"],
                    required : !!req.lokasi,
                    where : {
                        default_tujuan_order_permintaan : {[Op.iLike]: `%${req.lokasi || ""}%`}
                    }
                }
            ]
        }
        return Pagination.init(PenjualanObatModel, req, option);
    }

    static async updateOtc(req, transaction){
        await PenjualanObatModel.update(req, {
            where: {uuid: req.uuid},
            transaction
        });
    }

    static async getOtcByUuid(req){
       return await PenjualanObatModel.findOne({
            where : {
                uuid : req.uuid
            },
           attributes : {
               exclude: ['deleted_at', 'created_at', 'updated_at', 'status', 'faskes_uuid', 'id']
           },
            include : [
                {
                    model : ItemPenjualanObatModel,
                    as : "items",
                    attributes : {
                        exclude: ['deleted_at', 'created_at', 'updated_at', 'catatan_stok']
                    },
                    include : [
                        {
                            model : JenisStokModel,
                            as : "jenis_stok",
                            attributes : ["name"],
                        },
                        {
                            model : ItemMedisModel,
                            as : "item_medis",
                            attributes : ["name"],
                        },
                        {
                            model : SatuanModel,
                            as : "satuan",
                            attributes : ["name"],
                        }
                    ]
                },
                {
                    model : LokasiStokModel,
                    as : "lokasi_stok",
                    attributes : ["name"],
                },

            ]
        })
    }

    static async getAllCatatanStok(req){
        return await ItemPenjualanObatModel.findAll({
            where : {
                penjualan_obat_uuid : req.uuid
            },
            attributes : ["catatan_stok"]
        })
    }
}