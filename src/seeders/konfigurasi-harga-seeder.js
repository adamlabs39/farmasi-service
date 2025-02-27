import {KonfigurasiHargaModel} from "@adameds/model-sdk/farmasi";

export default class KonfigurasiHargaSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "created_at" :1731305299000,
                "metode_biaya_racikan" : "item"
            },
        ];

        await KonfigurasiHargaModel.bulkCreate(item, { transaction });

    }
}
