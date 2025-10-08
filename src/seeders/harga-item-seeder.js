import { v7 as uuidv7 } from "uuid";
import { HargaItemModel } from "@adameds/model-sdk/farmasi";

// 1. IMPOR UUID dari seeder 'item-medis-jenis-stok'
import {
  paracetamolUmumUuid,
  amoxicillinBpjsUuid,
  jarumSuntikUmumUuid,
} from "./item-medis-jenis-stok-seeder.js";

export default class HargaItemSeeder {
  static async seed(transaction) {
    await HargaItemModel.destroy({
      where: {},
      truncate: true,
      cascade: true,
      transaction,
    });

    const faskesUuid = "01981726-d5cf-7bc4-97ca-9804168283f7";

    const hargaItemsToSeed = [
      // Harga untuk Paracetamol jenis Umum
      {
        uuid: uuidv7(),
        faskes_uuid: faskesUuid,
        item_medis_jenis_stok_uuid: paracetamolUmumUuid, // Gunakan UUID dari tabel penghubung
        harga_terakhir: 52000,
        harga_avg: 51500,
        hna: 55000,
        harga_dasar: 50000,
      },
      // Harga untuk Amoxicillin jenis BPJS
      {
        uuid: uuidv7(),
        faskes_uuid: faskesUuid,
        item_medis_jenis_stok_uuid: amoxicillinBpjsUuid, // Gunakan UUID dari tabel penghubung
        harga_terakhir: 75000,
        harga_avg: 74000,
        hna: 80000,
        harga_dasar: 72000,
      },
      // Harga untuk Jarum Suntik jenis Umum
      {
        uuid: uuidv7(),
        faskes_uuid: faskesUuid,
        item_medis_jenis_stok_uuid: jarumSuntikUmumUuid, // Gunakan UUID dari tabel penghubung
        harga_terakhir: 1500,
        harga_avg: 1450,
        hna: 1700,
        harga_dasar: 1400,
      },
    ];

    await HargaItemModel.bulkCreate(hargaItemsToSeed, { transaction });
  }
}
