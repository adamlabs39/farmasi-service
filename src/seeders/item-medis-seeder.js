import ItemMedisModel from "../models/item-medis-model.js";

export default class ItemMedisSeeder {
    static async seed(transaction) {
        const item = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "bentuk_sediaan_uuid" : "sfmsfmskfmkadm",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "code" : "prcm",
                "name" : "paracetamol",
                "status" : true,
                "dosis" : 500,
                "satuan_dosis_uuid" : "ksmfskfmkm",
                "satuan_penggunaan_uuid" : "rwiermwerkpimo",
                "satuan_pembelian_uuid" : "kdmfkwmfkwmf",
                "jenis_item" : "obat",
                "kategori_obat_uuid" : "skmfskfmkf",
            },
        ];

        await ItemMedisModel.bulkCreate(item, { transaction });
    }
}
