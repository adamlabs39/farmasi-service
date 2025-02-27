import {StockMedisModel} from "@adameds/model-sdk/inventory";


export default class StokMedisSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "stok" : 5000,
                "sisa_stok" : 5000,
                "konversi_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "item_medis_jenis_stok_uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "stok" : 5000,
                "sisa_stok" : 5000,
                "konversi_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "item_medis_jenis_stok_uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475t",
                "stok" : 5000,
                "sisa_stok" : 5000,
                "konversi_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "item_medis_jenis_stok_uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475y",
                "stok" : 5000,
                "sisa_stok" : 5000,
                "konversi_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "item_medis_jenis_stok_uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "uuid": "alkes1-365d-731c-8b16-3a4565c9475e",
                "stok" : 5000,
                "sisa_stok" : 5000,
                "konversi_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "item_medis_jenis_stok_uuid": "alkes1-365d-731c-8b16-3a4565c9475e",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "uuid": "alkes-365d-731c-8b16-3a4565c9475e",
                "stok" : 5000,
                "sisa_stok" : 5000,
                "konversi_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "item_medis_jenis_stok_uuid": "alkes-365d-731c-8b16-3a4565c9475e",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "uuid": "stokparadential-365d-731c-8b16-3a4565c9475e",
                "stok" : 5000,
                "sisa_stok" : 5000,
                "konversi_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "item_medis_jenis_stok_uuid": "paradential-365d-731c-8b16-3a4565c9475e",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
            },
        ];

        await StockMedisModel.bulkCreate(item, { transaction });
    }
}