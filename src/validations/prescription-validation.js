import {z} from "zod";
import {faskesUuidRequired, required} from "./message-validation-error.js";

export default class PrescriptionValidation {
    static CREATE_PRESCRIPTION = z.object({
        faskes_uuid: z.string().min(1, faskesUuidRequired),
        no_resep: z.string().min(1, required),
        no_reg: z.string().min(1, required),
        patient_uuid: z.string().min(1, required),
        no_rm: z.string().min(1, required),
        order_status: z.number(),
        is_takeaway: z.boolean(),
        dokter_order: z.string().min(1, required),
        jenis_pelayanan: z.string().min(1, required),
        session_uuid: z.string().min(1, required),
    });

    static CREATE_PRESCRIPTION_ITEM = z.object({
        prescription_uuid: z.string().min(1, required),
        item_medis_uuid: z.string().min(1, required),
        medication_qty: z.number(),
        medication_dose_qty: z.number(),
        medication_dose_satuan_uuid: z.string().min(1, required),
        medication_period: z.string().min(1, required),
        aturan_pakai_uuid: z.string().min(1, required),
        cara_pakai_uuid: z.string().min(1, required),
        is_chronic: z.boolean(),
        route: z.string().min(1, required),
    });

    static CREATE_PRESCRIPTION_ITEM_RACIKAN = z.object({
        item_medis_uuid: z.string().min(1, required),
        medication_qty: z.number(),
    });

    static DELETE_PRESCRIPTION_ITEM = z.object({
        prescription_item_uuid: z.string().min(1, required),
    });

    static UPDATE_PRESCRIPTION = z.object({
        uuid: z.string().min(1, required),
        is_takeaway: z.boolean(),
        lokasi_stok_uuid: z.string().min(1, required),
    })

    static UPDATE_OBAT = z.object({
        uuid: z.string().min(1, required),
        type: z.string().min(1, required),
    })

    static GET_SOME_ORDER = z.object({
        uuides: z.array(z.string().min(1, required))
    })

    static UPDATE_TELAAH = z.object({
        uuid: z.string().min(1, required),
        status_telaah: z.boolean(),
        petugas_telaah: z.string().min(1, required),
    })

    static BATAL_ORDER = z.object({
        uuid: z.string().min(1, required),
        petugas_pembatalan: z.string().min(1, required),
        alasan_batal: z.string().min(1, required),
    })

    static UPDATE_VERIFIKASI = z.object({
        uuid: z.string().min(1, required),
    })

    static UPDATE_SIAP_DISERAHKAN = z.object({
        uuid: z.string().min(1, required),
    })

    static BATAL_DISERAHKAN = z.object({
        uuid: z.string().min(1, required),
    })

    static UPDATE_SERAHKAN = z.object({
        uuid: z.string().min(1, required),
        penerima: z.string().min(1, required),
        no_hp_penerima: z.string().min(1, required),
        petugas_edukasi: z.string().min(1, required),
    })

    static UPDATE_LOKASI_STOK = z.object({
        uuid: z.string().min(1, required),
        lokasi_stok_uuid: z.string().min(1, required)
    })

    static GET_ALL = z.object({
        faskes_uuid: z.string().min(1, required),
        start_date: z.number(),
        end_date: z.number()
    })

    static UPDATE_JENIS_ITEM = z.object({
        uuid: z.string().min(1, required),
        is_racikan: z.boolean(),
        jenis_stok_uuid: z.string().min(1, required),
    })

    STATUS_MORE_THAN = z.object({
        status: z.number(),
        prescription_uuid: z.string().min(1, required),
    })
}