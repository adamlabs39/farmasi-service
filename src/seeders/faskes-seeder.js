import {FaskesModel} from "@adameds/model-sdk/datamaster";

export default class FaskesSeeder {
    static async seed(transaction) {
        const faskes = [
            {
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "name": "RSUD Dr. Fauzy & Fauziah",
                "code": "ABCDD",
                "status": true
            }
        ];

        await FaskesModel.bulkCreate(faskes, { transaction });
    }
}