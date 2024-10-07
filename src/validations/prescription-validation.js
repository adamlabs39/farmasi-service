import {z} from "zod";
import {faskesUuidRequired, required} from "./message-validation-error.js";

export default class PrescriptionValidation {
    static CREATE_PRESCRIPTION = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        lokasi_stok_uuid : z.string().min(1, required),
        pelayananan : z.string().min(1, required),
        is_takeaway : z.boolean(),
    });
}