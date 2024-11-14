import {PrescriptionModel} from "@adameds/model-sdk/farmasi";

export default class PrescriptionSeeder {
    static async seed(transaction) {
        const prescription = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "no_reg": "REG1234",
                "no_rm": "string",
                "is_takeaway": false,
                "patient_uuid" : "1234abcd",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "jenis_pelayanan" : "igd",
                "no_resep" : "resep1",
                "order_status" : 1,
                "dokter_order" : "sujiwo",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "no_reg": "REG1234",
                "no_rm": "string",
                "is_takeaway": false,
                "patient_uuid" : "1234abcd",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "jenis_pelayanan" : "ri",
                "no_resep" : "resep2",
                "order_status" : 3,
                "dokter_order" : "sujiwo"
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475t",
                "no_reg": "REG1234",
                "no_rm": "string",
                "is_takeaway": false,
                "patient_uuid" : "1234abcd",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "jenis_pelayanan" : "igd",
                "no_resep" : "resep3",
                "order_status" : 4,
                "dokter_order" : "sujiwo"
            },
        ];

        await PrescriptionModel.bulkCreate(prescription, { transaction });
    }
}