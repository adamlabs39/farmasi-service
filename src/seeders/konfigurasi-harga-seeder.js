import {KonfigurasiHargaModel} from "@adameds/model-sdk/farmasi";

export default class KonfigurasiHargaSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "019328c1-1931-793e-83d0-488bbe962dd4",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "created_at" :1731305299000,
            },
        ];

        await KonfigurasiHargaModel.bulkCreate(item, { transaction });

    }
}
