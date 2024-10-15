import ItemMedisModel from "../models/item-medis-model.js";

export default class ItemMedisSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "9d403ufjh43ufh3uf8430ihf",
                "bentuk_sediaan_uuid" : "sfmsfmskfmkadm",
                "uuid": "9d403ufjh43ufh3uf8430ihg",
                "code" : "prcm",
                "name" : "paracetamol",
                "status" : true,
                "dosis" : 500,
                "satuan_dosis_uuid" : "ksmfskfmkm",
                "satuan_penggunaan_uuid" : "rwiermwerkpimo",
                "satuan_pembelian_uuid" : "kdmfkwmfkwmf",
                "harga_dasar" : 5000,
                "hna" : 6000,
                "hja" : 7000,
                "jenis_item" : "obat",
                "kategori_obat_uuid" : "skmfskfmkf",
                "jenis_stocks" : {
                    "name" : "tunai",
                    "uuid" : "9d403ufjh43ufh3uf8430ihg"
                }
            },
        ];

        await ItemMedisModel.bulkCreate(item, { transaction });
    }
}
