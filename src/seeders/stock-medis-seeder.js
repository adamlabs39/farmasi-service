import StockMedisModel from "../models/stock-medis-model.js";

export default class StockMedisSeeder {
    static async seed(transaction) {
        const stockMedis = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "item_medis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "stok" : 100,
                "sisa_stok" : 100,
                "konversi_uuid" : "",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e"
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "9d403ufjh43ufh3uf8430ihw",
                "item_medis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "stok" : 75,
                "sisa_stok" : 75,
                "konversi_uuid" : "",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 6000,
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e"
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "9d403ufjh43ufh3uf8430ihl",
                "item_medis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "stok" : 50,
                "sisa_stok" : 50,
                "konversi_uuid" : "",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 8000,
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475r"
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "9d403ufjh43ufh3uf8430ihr",
                "item_medis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "exp_date" : "2025-12-12",
                "stok" : 100,
                "sisa_stok" : 100,
                "konversi_uuid" : "",
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 5000,
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475r"
            },
        ];

        await StockMedisModel.bulkCreate(stockMedis, { transaction });
    }
}