import AturanPakaiModel from "../models/aturan-pakai-model.js";

export default class AturanPakaiSeeder {
    static async seed(transaction) {
        const aturanPakai = [
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "code" : "3xsehari",
                "name" : "3x sehari",
                "status" : true,
                "periode_unit" : "hari",
                "periode" : 1,
                "frekuensi" : 3,
            },
        ];

        await AturanPakaiModel.bulkCreate(aturanPakai, { transaction });
    }
}