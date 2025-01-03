import ZodValidator from "../validations/zod-validator.js";
import PrescriptionValidation from "../validations/prescription-validation.js";
import PrescriptionRepository from "../repositories/prescription-repository.js";
import AlkesRepository from "../repositories/alkes-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";
import RiwayatValidation from "../validations/riwayat-validation.js";
import ReturRepository from "../repositories/retur-repository.js";
import {setRangeDate} from "../helpers/date-helper.js";

export default class RiwayatService {
    static async getAll(req) {
        ZodValidator.validate(RiwayatValidation.GET_ALL, req);

        let result;
        req.pagination = true;
        req.subQuery = false;

        setRangeDate(req);

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
                    "kronis" : data.obat && data.obat.some(obat => obat.is_chronic),
                    "payment_method": data.payment_method === 1 ? "Tunai" : "Non Tunai",
                }
            }
        )

        return result;
    }

    static async getDetail(req){
        ZodValidator.validate(RiwayatValidation.GET_DETAIL, req);

        let result;

        if (req.item_type === "obat") {
            result = await PrescriptionRepository.getByUuid(req.uuid);

            if (req.status_type === "retur"){
                const retur = await ReturRepository.getObatOne({
                    no_resep: result.no_resep
                });

                result.dataValues.obat = undefined;
                result.dataValues.retur = retur;
            }
        }

        else if (req.item_type === "alkes") {
            result = await AlkesRepository.getByUuid(req.uuid);

            if (req.status_type === "retur"){
                const retur = await ReturRepository.getAlkesOne({
                    no_order_alkes: result.no_order_alkes
                });

                result.dataValues.alkes_items = undefined;
                result.dataValues.retur = retur;
            }
        }

        const data = [];

        if (result.order_date ?? result.created_at) {
            data.push({
                "status": "Order Resep",
                "date": result.order_date ?? result.created_at,
                "petugas": result.dokter_order ?? result.petugas_order,
            })
        }

        if (result.waktu_verifikasi) {
            data.push({
                "status": "Verifikasi Resep",
                "date": result.waktu_verifikasi,
                "petugas": result.petugas_verifikasi,
            })
        }

        if (result.waktu_penyiapan) {
            data.push({
                "status": "Disiapkan Oleh",
                "date": result.waktu_penyiapan,
                "petugas": result.petugas_penyiapan_obat,
            })
        }

        if (result.waktu_pemberian) {
            data.push({
                "status": "Diberikan Oleh",
                "date": result.waktu_pemberian,
                "petugas": result.petugas_pemberi,
            })
        }

        if (result.waktu_retur){
            data.push({
                "status": "Diretur Oleh",
                "date": result.waktu_retur,
                "petugas": result.petugas_retur,
            })
        }

        if (result.petugas_pembatalan){
            data.push({
                "status": "Dibatalkan Oleh",
                "date": result.updated_at,
                "petugas": result.petugas_pembatalan,
            })
        }

        result.dataValues.payment_method = result.payment_method == 1 ? "Tunai" : "Non Tunai";
        result.dataValues.history = data;

        return result
    }
}