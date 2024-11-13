import BadRequestException from "../errors/bad-request-exception.js";
import {KonfigurasiHargaModel} from "@adameds/model-sdk/farmasi";

export default class KonfigurasiHargaRepository {
    static async get(faskes_uuid) {
        const result = await KonfigurasiHargaModel.findOne({
            where: {
                faskes_uuid : faskes_uuid,
                deleted_at: null,
            },
        });


        if (!result){
            throw new BadRequestException("Konfigurasi harga belum di set");
        } else {
            return result;
        }
    }

    static async create(req) {
        return await KonfigurasiHargaModel.create(req);
    }

    static async update(req) {
        const affectedRow = await KonfigurasiHargaModel.update(req, {
            where: {
                faskes_uuid: req.faskes_uuid,
            }
        });

        return affectedRow[0];
    }
}