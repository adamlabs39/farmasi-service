import {ManufactureModel} from "@adameds/model-sdk/farmasi";

export default class ManufacureSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "code" : "mn1",
                "name" : "manufaktur 1",
                "status" : true,
                "alamat" : "Jl. Jalan",
                "kode_pos" : "12345",
                "kecamatan_code" : "kec1",
                "provinsi_code" : "prov1",
                "kabupaten_code" : "kab1",
                "kelurahan_code" : "kel1"
            }
        ];

        await ManufactureModel.bulkCreate(item, { transaction });

    }
}
