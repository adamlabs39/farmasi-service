import Pagination from "../helpers/pagination.js";
import {Op} from "sequelize";
import {toEpochDate} from "../helpers/date-helper.js";
import {KabupatenModel, KecamatanModel, KelurahanModel, ProvinceModel} from "@adameds/model-sdk/datamaster";
import {ManufactureModel} from "@adameds/model-sdk/farmasi";
import NotfoundException from "../errors/notfound-exception.js";

export default class DataMasterManufactureRepository {
    static async create(req) {
        return await ManufactureModel.create(req);
    }

    static async getAll(req) {
        const option = {
            where: {
                faskes_uuid : req.faskes_uuid,
                name : {[Op.iLike]: `%${req.name || ""}%`},
                deleted_at: {
                    [Op.is]: null,
                },
            },
            include: [
                {
                    model: ProvinceModel,
                    as: "province",
                    required: false,
                    attributes: [
                        "code", "name"
                    ]
                },
                {
                    model: KabupatenModel,
                    as: "kabupaten",
                    required: false,
                    attributes: [
                        "code", "name"
                    ]
                },
                {
                    model: KecamatanModel,
                    as: "kecamatan",
                    required: false,
                    attributes: [
                        "code", "name"
                    ]
                },
                {
                    model: KelurahanModel,
                    as: "kelurahan",
                    required: false,
                    attributes: [
                        "code", "name"
                    ]
                }
            ],
        };

        return Pagination.init(ManufactureModel, req, option);
    }

    static async update(req) {
        const [affectedRow] =  await ManufactureModel.update(req, {
            where: {
                uuid: req.uuid,
            }
        });

        if (affectedRow === 0) {
            throw new NotfoundException("Data gagal diedit");
        }

        return affectedRow;
    }

    static async delete(req) {
        const [affectedRow] = await ManufactureModel.update({
            deleted_at : toEpochDate(new Date())
        },{
            where: {
                uuid: req.uuid,
            }
        });

        if (affectedRow === 0) {
            throw new NotfoundException("Data gagal dihapus");
        }

        return affectedRow;
    }

    static async getUuidesByCodes(codes, faskesUuid) {
        return ManufactureModel.findAll({
            where: {
                code: {
                    [Op.in]: codes
                },
                faskes_uuid: faskesUuid
            },
            attributes: ['uuid', 'code']
        });
    }

    static bulkCreate(data) {
        return ManufactureModel.bulkCreate(data);
    }
}