import {BentukSediaanModel} from "@adameds/model-sdk/farmasi";


export default class BentukSediaanSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "code" : "bs1",
                "name" : "bentuk sediaan 1",
                "status" : true
            }
        ];

        await BentukSediaanModel.bulkCreate(item, { transaction });

    }
}
