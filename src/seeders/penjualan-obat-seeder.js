import {ItemPenjualanObatModel, PenjualanObatModel} from "@adameds/model-sdk/farmasi";


export default class PenjualanObatSeeder {
    static async seed(transaction) {
        const data = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "no_transaksi" : "123456",
                "tanggal_pembelian" : 1731305299000,
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "dokter_pemberi_resep" : "Dr. Adam",
                "nama_pembeli" : "Adam",
                "no_hp" : "08123456789",
                "catatan" : "Catatan",
                "total_harga" : 10000,
                "total_item" : 1,
                "status" : "belum_lunas",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "no_transaksi" : "123455",
                "tanggal_pembelian" : 1731305299000,
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "dokter_pemberi_resep" : "Dr. Adam",
                "nama_pembeli" : "Adam",
                "no_hp" : "08123456789",
                "catatan" : "Catatan",
                "total_harga" : 10000,
                "total_item" : 1,
                "status" : "lunas",
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475t",
                "no_transaksi" : "123454",
                "tanggal_pembelian" : 1731305299000,
                "lokasi_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "dokter_pemberi_resep" : "Dr. Adam",
                "nama_pembeli" : "Adam",
                "no_hp" : "08123456789",
                "catatan" : "Catatan",
                "total_harga" : 10000,
                "total_item" : 1,
                "status" : "cancel",
                "alasan_batal" : "gamau a gelai"
            },
        ];

        await PenjualanObatModel.bulkCreate(data, { transaction });

        const items = [
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475e",
                "penjualan_obat_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "item_medis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "qty" : 10,
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 500,
                "diskon" : 10
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475r",
                "penjualan_obat_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475r",
                "item_medis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "qty" : 10,
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 500,
                "diskon" : 10
            },
            {
                "faskes_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "uuid": "0192b31f-365d-731c-8b16-3a4565c9475t",
                "penjualan_obat_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475t",
                "item_medis_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "qty" : 10,
                "jenis_stok_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "satuan_uuid" : "0192b31f-365d-731c-8b16-3a4565c9475e",
                "harga_satuan" : 500,
                "diskon" : 10
            },
        ]

        await ItemPenjualanObatModel.bulkCreate(items, { transaction });
    }
}