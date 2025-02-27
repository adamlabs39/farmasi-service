import SatuanModel from "../models/satuan-model.js";

export default class SatuanSeeder {
    static async seed(transaction) {
        const satuan = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "code" : "BTL",
                "name" : "Botol",
                "status" : true,
            },
        ];

        await SatuanModel.bulkCreate(satuan, { transaction });
    }
}