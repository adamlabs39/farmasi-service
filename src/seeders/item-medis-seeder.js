import {ItemMedisModel} from "@adameds/model-sdk/farmasi";

export default class ItemMedisSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "bentuk_sediaan_uuid" : "sfmsfmskfmkadm",
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
                "manufacture_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e"
            },
        ];

        await ItemMedisModel.bulkCreate(item, { transaction });
    }
}
