import StockMedisModel from "../models/stock-medis-model.js";

export default class StockMedisSeeder {
    static async seed(transaction) {
        const stockMedis = [
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "item_medis_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "exp_date" : "2025-12-12",
                "stok" : 100,
                "sisa_stok" : 100,
                "konversi_uuid" : "",
                "lokasi_stok_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "harga_satuan" : 5000,
                "jenis_stok_uuid" : "wmfkkfms.dnfwfwfk.ckmekfo"
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihw",
                "item_medis_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "exp_date" : "2025-12-12",
                "stok" : 75,
                "sisa_stok" : 75,
                "konversi_uuid" : "",
                "lokasi_stok_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "harga_satuan" : 6000,
                "jenis_stok_uuid" : "wmfkkfms.dnfwfwfk.ckmekfo"
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihl",
                "item_medis_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "exp_date" : "2025-12-12",
                "stok" : 50,
                "sisa_stok" : 50,
                "konversi_uuid" : "",
                "lokasi_stok_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "harga_satuan" : 8000,
                "jenis_stok_uuid" : "wmfkkfms.dnfwfwfk.ckmekfo"
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihr",
                "item_medis_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "exp_date" : "2025-12-12",
                "stok" : 100,
                "sisa_stok" : 100,
                "konversi_uuid" : "",
                "lokasi_stok_uuid" : "9d403ufjh43ufh3uf8430ihg",
                "harga_satuan" : 5000,
                "jenis_stok_uuid" : "wmfkkfms.dnfwfwfk.ckmekfo"
            },
        ];

        await StockMedisModel.bulkCreate(stockMedis, { transaction });
    }
}