import ItemMedisModel from "../models/item-medis-model.js";
import JenisStokModel from "../models/jenis-stok-model.js";

export default class JenisStokSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "code" : "bpjs",
                "name" : "bpjs",
                "status" : true,
            },
            {
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "code" : "um",
                "name" : "umum",
                "status" : true,
            },{
                "faskes_uuid" : "192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475t",
                "code" : "mdr",
                "name" : "mandiri",
                "status" : true,

            },
        ];

        await JenisStokModel.bulkCreate(item, { transaction });
    }
}
