import ZodValidator from "../validations/zod-validator.js";
import PrescriptionValidation from "../validations/prescription-validation.js";
import PrescriptionRepository from "../repositories/prescription-repository.js";
import AlkesRepository from "../repositories/alkes-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";
import RiwayatValidation from "../validations/riwayat-validation.js";

export default class RiwayatService {
    static async getAll(req) {
        ZodValidator.validate(RiwayatValidation.GET_ALL, req);

        let result;
        req.pagination = true;
        req.subQuery = false;

        if (req.item_type === "obat") {
            if (req.status_type === "resep") {
                req.status = [5, 5]
            } else if (req.status_type === "retur") {
                req.status = [6, 6]
            } else if (req.status_type === "batal") {
                req.status = [0, 0]
            }

            ZodValidator.validate(PrescriptionValidation.GET_ALL, req);
            result = await PrescriptionRepository.getAllPrescription(req);
        } else if (req.item_type === "alkes") {
            if (req.status_type === "resep") {
                req.status = [4, 4]
            } else if (req.status_type === "retur") {
                req.status = [5, 5]
            } else if (req.status_type === "batal") {
                req.status = [0, 0]
            }

            ZodValidator.validate(PrescriptionValidation.GET_ALL, req);
            result = await AlkesRepository.getAllForFarmacy(req);
        }

        if (!result) {
            throw new BadRequestException("Data not found");
        }

        // map data
        result.data = result.data.map((data) => {
                return {
                    "uuid": data.uuid,
                    "code": data.no_order_alkes ?? data.no_resep,
                    "date": data.order_date ?? data.created_at,
                    "name": data.patient?.name,
                    "no_reg": data.no_reg,
                    "no_rm": data.no_rm,
                    "jenis_pelayanan": data.jenis_pelayanan,
                    "lokasi_stok": data.lokasi_stok?.name,
                    "racikan": data.obat && data.obat.some(obat => obat.is_compound),
                    "kronis" : data.obat && data.obat.some(obat => obat.is_chronic)
                }
            }
        )

        return result;
    }
}