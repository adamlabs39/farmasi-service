import { ConversionModel } from "@adameds/model-sdk/farmasi";

export default class ConversionSeeder {
     static async seed(transaction) {
            const conversion = [
                {
                    "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                    "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                    "item_medis_uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                    "satuan_pembelian_uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                    "satuan_pembelian": "pcs",
                    "satuan_penggunaan_uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                    "satuan_penggunaan": "biji",
                    "konversi": 2,
                    "status": true,
                },
            ];
    
            await ConversionModel.bulkCreate(conversion, { transaction });
        }
}