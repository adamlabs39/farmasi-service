import PrescriptionModel from "../models/prescription-model.js";

export default class PrescriptionSeeder {
    static async seed(transaction) {
        const prescription = [
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "no_reg": "REG1234",
                "no_rm": "string",
                "is_takeaway": false,
                "patient_uuid" : "1234abcd",
                "lokasi_stok_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "jenis_pelayanan" : "igd",
                "no_resep" : "resep1",
                "order_status" : 1,
                "dokter_order" : "sujiwo",
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihi",
                "no_reg": "REG1234",
                "no_rm": "string",
                "is_takeaway": false,
                "patient_uuid" : "1234abcd",
                "lokasi_stok_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "jenis_pelayanan" : "ri",
                "no_resep" : "resep2",
                "order_status" : 3,
                "dokter_order" : "sujiwo"
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihh",
                "no_reg": "REG1234",
                "no_rm": "string",
                "is_takeaway": false,
                "patient_uuid" : "1234abcd",
                "lokasi_stok_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "jenis_pelayanan" : "igd",
                "no_resep" : "resep3",
                "order_status" : 4,
                "dokter_order" : "sujiwo"
            },
        ];

        await PrescriptionModel.bulkCreate(prescription, { transaction });
    }
}