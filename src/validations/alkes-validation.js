import {z} from "zod";
import {faskesUuidRequired, required} from "./message-validation-error.js";

export default class AlkesValidation {
    static ORDER_ALKES = z.object({
        faskes_uuid: z.string().min(1, faskesUuidRequired),
        no_reg: z.string().min(1, required),
        patient_uuid: z.string().min(1, required),
        no_rm: z.string().min(1, required),
        jenis_pelayanan: z.string().min(1, required),
        rekam_medis_uuid: z.string().min(1, required),
        petugas_order: z.string().min(1, required),
        rekam_medis_date: z.string().min(1, required),
        lokasi_uuid : z.string().min(1, required)
    });

    static CREATE_ALKES_ITEM = z.object({
        item_medis_uuid: z.string().min(1, required),
        order_alkes_uuid: z.string().min(1, required),
        qty: z.number().min(1, required),
    });

    static GET_SOME_ORDER = z.object({
        rekam_medis_uuid: z.string().min(1, required),
        rekam_medis_date: z.string().min(1, required),
    });

    static DELETE_ALKES_ITEM = z.object({
        alkes_item_uuid: z.string().min(1, required),
    });

    static UPDATE_ALKES = z.object({
        uuid: z.string().min(1, required),
        lokasi_stok_uuid: z.string().min(1, required),
    });

    static UPDATE_ALKES_ITEM = z.object({
        uuid: z.string().min(1, required),
        qty: z.number().min(1, required),
        item_medis_uuid: z.string().min(1, required),
    });
}