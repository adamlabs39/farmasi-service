import ItemMedisJenisStokModel from "../models/item-medis-jenis-stok-model.js";

export default class ItemMedisJenisStokSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "item_medis_uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "item_medis_uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475r",
            },
            {
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475s",
                "item_medis_uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "alkes-365d-731c-8b16-3a4565c9475e",
                "item_medis_uuid": "alkes-365d-731c-8b16-3a4565c9475r",
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "alkes1-365d-731c-8b16-3a4565c9475e",
                "item_medis_uuid": "alkes1-365d-731c-8b16-3a4565c9475r",
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "paradential-365d-731c-8b16-3a4565c9475e",
                "item_medis_uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "jenis_stok_uuid" : "prudential-365d-731c-8b16-3a4565c9475e",
            },
        ];

        await ItemMedisJenisStokModel.bulkCreate(item, { transaction });

    }
}
