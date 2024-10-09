import {z} from "zod";
import {faskesUuidRequired, required} from "./message-validation-error.js";

export default class PrescriptionValidation {
    static CREATE_PRESCRIPTION = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        no_resep : z.string().min(1, required),
        no_reg : z.string().min(1, required),
        patient_uuid : z.string().min(1, required),
        no_rm : z.string().min(1, required),
        order_status : z.number(),
        is_takeaway : z.boolean(),
        dokter_order : z.string().min(1, required),
        lokasi_stok_uuid : z.string().min(1, required),
        jenis_pelayanan : z.string().min(1, required),
    });

    static CREATE_PRESCRIPTION_ITEM = z.object({
        item_medis_uuid : z.string().min(1, required),
        medication_qty : z.number(),
        medication_dose_qty : z.number(),
        medication_dose_satuan_uuid : z.string().min(1, required),
        medication_period : z.string().min(1, required),
        aturan_pakai_uuid : z.string().min(1, required),
        cara_pakai_uuid : z.string().min(1, required),
        is_chronic : z.boolean(),
        route : z.string().min(1, required),
    });

    static CREATE_PRESCRIPTION_ITEM_RACIKAN = z.object({
        item_medis_uuid : z.string().min(1, required),
        medication_qty : z.number(),
    });
}