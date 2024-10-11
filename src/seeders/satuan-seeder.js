import SatuanModel from "../models/satuan-model.js";

export default class SatuanSeeder {
    static async seed(transaction) {
        const satuan = [
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "code" : "btl",
                "name" : "Botol",
                "status" : true,
            },
        ];

        await SatuanModel.bulkCreate(satuan, { transaction });
    }
}