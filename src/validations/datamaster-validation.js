import { z } from "zod";
import {faskesUuidRequired, required, uuidRequired} from "./message-validation-error.js";

export default class DatamasterValidation {
    static CREATE_SATUAN = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
    });

    static UPDATE_SATUAN = z.object({
        uuid : z.string().min(1, uuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
    });

    static GET_ALL_SATUAN = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
    })

    static DELETE_SATUAN = z.object({
        uuid : z.string().min(1, uuidRequired),
    })
}