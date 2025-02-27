import {BentukSediaanModel, KategoriObatModel} from "@adameds/model-sdk/farmasi";


export default class KategoriObatSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "code" : "KATEGORI1",
                "name" : "kategori 1",
                "status" : true
            }
        ];

        await KategoriObatModel.bulkCreate(item, { transaction });

    }
}
