import HargaItemModel from "../models/harga-item-model.js";

export default class HargaItemSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475w",
                "item_medis_jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475r",
                "harga_terakhir" : 5780,
                "harga_avg" : 6000,
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475j",
                "item_medis_jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475r",
                "harga_terakhir" : 8000,
                "harga_avg" : 6000,
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "item_medis_jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_terakhir" : 5780,
                "harga_avg" : 6000,
            },
        ];

        await HargaItemModel.bulkCreate(item, { transaction });
    }
}
