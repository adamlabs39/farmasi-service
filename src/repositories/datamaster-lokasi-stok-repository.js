import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import {LokasiStokModel} from "@adameds/model-sdk/farmasi";
import BadRequestException from "../errors/bad-request-exception.js";

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
                default_tujuan_order_permintaan : {[Op.iLike]: `%${req.kode_tujuan || ""}%`},
                deleted_at: {
                    [Op.is]: null,
                },
            },
        };

        if (req.jenis_lokasi) {
            option.where.jenis_lokasi = req.jenis_lokasi;
        }

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
        const [affectedRow] = await LokasiStokModel.update({
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

    static async bulkCreate(data) {
        return await LokasiStokModel.bulkCreate(data);
    }
}