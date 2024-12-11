import {ItemMedisModel} from "@adameds/model-sdk/farmasi";

export default class ItemMedisSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "bentuk_sediaan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "code" : "prcm",
                "name" : "paracetamol",
                "status" : true,
                "dosis" : 500,
                "satuan_dosis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_penggunaan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_pembelian_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "jenis_item" : "obat",
                "kategori_obat_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_kemasan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "manufacture_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e"
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "bentuk_sediaan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "code" : "dpt",
                "name" : "diapet",
                "status" : true,
                "dosis" : 500,
                "satuan_dosis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_penggunaan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_pembelian_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_kemasan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "jenis_item" : "obat",
                "kategori_obat_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "manufacture_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e"
            },
        ];

        await ItemMedisModel.bulkCreate(item, { transaction });
    }
}
