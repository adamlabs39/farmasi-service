import LokasiStokModel from "../models/lokasi-stok-model.js";

export default class LokasiStokSeeder {
    static async seed(transaction) {
        const lokasiStok = [
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "code" : "LOKASI1",
                "name" : "Lokasi 1",
                "status" : true,
                "jenis_lokasi" : "depo",
                "default_tujuan_order_permintaan" : "0",
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihj",
                "code" : "LOKASI2",
                "name" : "Lokasi 2",
                "status" : true,
                "jenis_lokasi" : "depo",
                "default_tujuan_order_permintaan" : "01",
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430ihq",
                "code" : "LOKASI3",
                "name" : "Lokasi 3",
                "status" : true,
                "jenis_lokasi" : "depo",
                "default_tujuan_order_permintaan" : "012",
            },
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "uuid": "9d403ufjh43ufh3uf8430iqqg",
                "code" : "LOKASI4",
                "name" : "Lokasi 4",
                "status" : true,
                "jenis_lokasi" : "depo",
                "default_tujuan_order_permintaan" : "0123",
            },
        ];

        await LokasiStokModel.bulkCreate(lokasiStok, { transaction });
    }
}