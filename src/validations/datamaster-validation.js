import { z } from "zod";
import {faskesUuidRequired, required, uuidRequired} from "./message-validation-error.js";

export default class DatamasterValidation {
    static CREATE_SATUAN = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
    });

    static CREATE_INGREDIENT = z.object({
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
    });

    static CREATE_BENTUK_RACIKAN = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        nama_bentuk_racikan:  z.string().min(1, required),
        jumlah: z.number(),
        tarif_embalase: z.number(),
        tarif_racik: z.number()
    });

    static CREATE_ATURAN_PAKAI = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        status : z.boolean(),
        frekuensi : z.number(),
        name : z.string().min(1, required),
        periode_unit : z.string().min(1, required),
        periode : z.number(),
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

    static CREATE_LOKASI_STOK = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
        jenis_lokasi : z.string().min(1, required),
        default_tujuan_order_permintaan : z.string().min(1, required),
    });

    static UPDATE_SATUAN = z.object({
        uuid : z.string().min(1, uuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
    });

    static UPDATE_BENTUK_RACIKAN = z.object({
        uuid : z.string().min(1, uuidRequired),
        nama_bentuk_racikan:  z.string().min(1, required),
        jumlah: z.number(),
        tarif_embalase: z.number(),
        tarif_racik: z.number()
    });

    static UPDATE_ATURAN_PAKAI = z.object({
        uuid : z.string().min(1, uuidRequired),
        status : z.boolean(),
        frekuensi : z.number(),
        periode_unit : z.string().min(1, required),
        name : z.string().min(1, required),
        periode : z.number(),
        code : z.string().min(1, required),
    });

    static UPDATE_LOKASI_STOK = z.object({
        uuid : z.string().min(1, uuidRequired),
        status : z.boolean(),
        name : z.string().min(1, required),
        code : z.string().min(1, required),
        jenis_lokasi : z.string().min(1, required),
        default_tujuan_order_permintaan : z.string().min(1, required),
    })

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

    static CREATE_ITEM_MEDIS = z.object({
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        code : z.string().min(1, required),
        name : z.string().min(1, required),
        jenis_item : z.string().min(1, required),
        satuan_penggunaan_uuid : z.string().min(1, required),
        manufacture_uuid : z.string().min(1, required),
        bentuk_sediaan_uuid : z.string().min(1, required),
        dosis : z.number(),
        satuan_dosis_uuid : z.string().min(1, required),
        isi_kemasan : z.number(),
        satuan_kemasan_uuid : z.string().min(1, required),
        kategori_obat_uuid : z.string().min(1, required),
        satuan_pembelian_uuid : z.string().min(1, required),
        harga_dasar : z.number(),
        hna : z.number(),
        hja : z.number(),
        stock_min : z.number(),
        stock_max : z.number(),
        status : z.boolean(),
    });

    static UPDATE_ITEM_MEDIS = z.object({
        uuid : z.string().min(1, uuidRequired),
        faskes_uuid : z.string().min(1, faskesUuidRequired),
        code : z.string().min(1, required),
        name : z.string().min(1, required),
        jenis_item : z.string().min(1, required),
        satuan_penggunaan_uuid : z.string().min(1, required),
        manufacture_uuid : z.string().min(1, required),
        bentuk_sediaan_uuid : z.string().min(1, required),
        dosis : z.number(),
        satuan_dosis_uuid : z.string().min(1, required),
        isi_kemasan : z.number(),
        satuan_kemasan_uuid : z.string().min(1, required),
        kategori_obat_uuid : z.string().min(1, required),
        satuan_pembelian_uuid : z.string().min(1, required),
        harga_dasar : z.number(),
        hna : z.number(),
        hja : z.number(),
        stock_min : z.number(),
        stock_max : z.number(),
        status : z.boolean(),
    });

    static GET_CONVERSIONS = z.object({
        item_medis_uuid : z.string().min(1, uuidRequired),
    })
}