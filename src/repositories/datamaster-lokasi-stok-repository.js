import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import LokasiStokModel from "../models/lokasi-stok-model.js";

export default class DataMasterLokasiStokRepository {
    static async create(req) {
        return await LokasiStokModel.create({
            code: req.code,
            name: req.name,
            status: req.status,
            jenis_lokasi : req.jenis_lokasi,
            default_tujuan_order_permintaan : req.default_tujuan_order_permintaan,
            faskes_uuid : req.faskes_uuid,
        });
    }

    static async getAll(req) {
        const option = {
            where: {
                faskes_uuid : req.faskes_uuid,
                name : {[Op.iLike]: `%${req.name || ""}%`},
                jenis_lokasi : req.jenis_lokasi,
                deleted_at: {
                    [Op.is]: null,
                },
            },
        };

        return Pagination.init(LokasiStokModel, req, option);
    }

    static async update(req) {
        return await LokasiStokModel.update({
            code: req.code,
            name: req.name,
            status: req.status,
            jenis_lokasi : req.jenis_lokasi,
            default_tujuan_order_permintaan : req.default_tujuan_order_permintaan,
        }, {
            where: {
                uuid: req.uuid,
            }
        });
    }

    static async delete(req) {
        return await LokasiStokModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });
    }
}