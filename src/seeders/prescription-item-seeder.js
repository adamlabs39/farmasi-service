import PrescriptionItemModel from "../models/prescription-item-model.js";

export default class PrescriptionItemSeeder {
    static async seed(transaction) {
        const prescriptionItem = [
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "medication_qty" : 1,
                "sisa_qty_order" : 1,
                "item_medis_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "medication_dose_qty" : 1,
                "medication_dose_satuan_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "medication_period" : "hari",
                "aturan_pakai_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "cara_pakai_uuid" : "1234abcd",
                "prescription_notes" : "",
                "is_chronic" : true,
                "route" : "anal",
                "prescription_uuid" : "9d403ufjh43ufh3uf8430ihg",
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihj",
                "medication_qty" : 1,
                "sisa_qty_order" : 1,
                "item_medis_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "medication_dose_qty" : 1,
                "medication_dose_satuan_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "medication_period" : "hari",
                "aturan_pakai_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "cara_pakai_uuid" : "1234abcd",
                "prescription_notes" : "",
                "is_chronic" : true,
                "route" : "anal",
                "is_compound" : true,
                "prescription_uuid" : "9d403ufjh43ufh3uf8430ihg",
            },
        ];

        await PrescriptionItemModel.bulkCreate(prescriptionItem, { transaction });
    }
}