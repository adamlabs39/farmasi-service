import PrescriptionRepository from "../repositories/prescription-repository.js";
import ZodValidator from "../validations/zod-validator.js";
import ReportValidation from "../validations/report-validation.js";
import {setRangeDate} from "../helpers/date-helper.js";

export default class ReportService {
    static async getPendapatan(req){
        setRangeDate(req);

        ZodValidator.validate(ReportValidation.GET_PENDAPATAN, req);

        return await PrescriptionRepository.getPendapatan(req);
    }

    static async getTat(req){
        setRangeDate(req);

        ZodValidator.validate(ReportValidation.GET_TAT, req);

        const result = await PrescriptionRepository.getTat(req);

        if (result.data){
            result.data.forEach((element) => {
                element.jumlah_racikan = element.obat.filter(item => item.is_compound === true).length;
                element.payment_method = element.payment_method === 1 ? "Tunai" : "Asuransi";
                element.patient = element.patient?.name || "-";
                element.asal_resep = element.lokasi_stok?.name || "-";
                element.lokasi_stok = undefined;
                element.waktu_pelayanan = (element.waktu_pemberian || 0)-(element.waktu_verifikasi || 0)
                element.jenis_resep = element.jumlah_racikan > 0 ? element.jumlah_racikan === element.obat.length ? "Racikan" : "Racikan & Non-Racikan" : "Non-Racikan"
                element.obat = undefined;

                const hours = Math.floor(element.waktu_pelayanan / 3600);
                const minutes = Math.floor((element.waktu_pelayanan % 3600) / 60);
                const remainingSeconds = element.waktu_pelayanan % 60;

                element.waktu_pelayanan = `${String(hours).padStart(2, '0')}.${String(minutes).padStart(2, '0')}.${String(remainingSeconds).padStart(2, '0')}`;
            });
        }

        return result;
    }
}