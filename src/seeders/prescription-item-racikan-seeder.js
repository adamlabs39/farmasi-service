import PrescriptionItemRacikanModel from "../models/prescription-item-racikan-model.js";

export default class PrescriptionItemRacikanSeeder {
    static async seed(transaction) {
        const racikan = [
            {
                "faskes_uuid": "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "item_medis_uuid": "9d403ufjh43ufh3uf8430ihg",
                "medication_qty": 5,
                "prescription_item_uuid": "9d403ufjh43ufh3uf8430ihj"
            },
            {
                "faskes_uuid": "9d403ufjh43ufh3uf8430ihf",
                "uuid": "afmksffgjnefgmsfosfmefjkvsdl",
                "item_medis_uuid": "9d403ufjh43ufh3uf8430ihg",
                "medication_qty": 5,
                "prescription_item_uuid": "9d403ufjh43ufh3uf8430ihj"
            },
            {
                "faskes_uuid": "9d403ufjh43ufh3uf8430ihf",
                "uuid": "akfmfwepfkwfmrofmqkdqpfkwefkm",
                "item_medis_uuid": "9d403ufjh43ufh3uf8430ihg",
                "medication_qty": 5,
                "prescription_item_uuid": "9d403ufjh43ufh3uf8430ihj"
            }
        ];

        await PrescriptionItemRacikanModel.bulkCreate(racikan, { transaction });
    }
}