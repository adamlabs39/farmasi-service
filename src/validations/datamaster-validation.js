import { z } from "zod";
import {faskesUuidRequired, required, uuidRequired} from "./message-validation-error.js";

export default class DatamasterValidation {
    static CREATE_SATUAN = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
    });

    static CREATE_MANUFACTURE = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
        alamat : z.string().min(1, required),
        kecamatan_uuid : z.string().min(1, required),
        kabupaten_uuid : z.string().min(1, required),
        provinsi_uuid : z.string().min(1, required),
        kecamatan : z.string().min(1, required),
        kabupaten : z.string().min(1, required),
        provinsi : z.string().min(1, required),
    });

    static UPDATE_SATUAN = z.object({
        uuid : z.string().min(1, uuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
    });

    static UPDATE_MANUFACTURE = z.object({
        uuid : z.string().min(1, uuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
        alamat : z.string().min(1, required),
        kecamatan_uuid : z.string().min(1, required),
        kabupaten_uuid : z.string().min(1, required),
        provinsi_uuid : z.string().min(1, required),
        kecamatan : z.string().min(1, required),
        kabupaten : z.string().min(1, required),
        provinsi : z.string().min(1, required),
    });

    static GET_ALL_SATUAN = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
    })

    static DELETE_SATUAN = z.object({
        uuid : z.string().min(1, uuidRequired),
    })

    static CREATE_CARA_PAKAI = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        status : z.boolean(),
        cara_pakai : z.string().min(1, required),
        code : z.string().min(1, required),
    });

    static UPDATE_CARA_PAKAI = z.object({
        uuid : z.string().min(1, uuidRequired),
        status : z.boolean(),
        cara_pakai : z.string().min(1, required),
        code : z.string().min(1, required),
    });
}