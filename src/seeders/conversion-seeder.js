import { v7 as uuidv7 } from "uuid";
import { ConversionModel } from "@adameds/model-sdk/farmasi"; // Pastikan path import benar

// 1. IMPOR UUID dari seeder-seeder induk
import {
  itemParacetamolUuid,
  itemAmoxicillinUuid,
  itemJarumSuntikUuid,
} from "./item-medis-seeder.js";
import {
  satuanPenggunaanPcsUuid,
  satuanBoxUuid, // Asumsi Anda mengekspor ini dari satuan-seeder.js
  satuanStripUuid, // Asumsi Anda mengekspor ini dari satuan-seeder.js
} from "./satuan-seeder.js";

// 2. EKSPOR UUID miliknya sendiri untuk seeder lain
export const konversiParacetamolBoxUuid = uuidv7();
export const konversiAmoxicillinStripUuid = uuidv7();
export const konversiJarumSuntikPcsUuid = uuidv7();

export default class ConversionSeeder {
  static async seed(transaction) {
    await ConversionModel.destroy({
      where: {},
      truncate: true,
      cascade: true,
      transaction,
    });

    const faskesUuid = "01981726-d5cf-7bc4-97ca-9804168283f7";

    const conversionsToSeed = [
      // Konversi untuk Paracetamol: 1 Box = 100 Pcs
      {
        uuid: konversiParacetamolBoxUuid,
        faskes_uuid: faskesUuid,
        item_medis_uuid: itemParacetamolUuid,
        satuan_pembelian_uuid: satuanBoxUuid,
        satuan_pembelian: "Box",
        satuan_penggunaan_uuid: satuanPenggunaanPcsUuid,
        satuan_penggunaan: "Pieces",
        konversi: 100,
        status: true,
      },
      // Konversi untuk Amoxicillin: 1 Strip = 10 Pcs
      {
        uuid: konversiAmoxicillinStripUuid,
        faskes_uuid: faskesUuid,
        item_medis_uuid: itemAmoxicillinUuid,
        satuan_pembelian_uuid: satuanStripUuid,
        satuan_pembelian: "Strip",
        satuan_penggunaan_uuid: satuanPenggunaanPcsUuid,
        satuan_penggunaan: "Pieces",
        konversi: 10,
        status: true,
      },
      // Konversi untuk Jarum Suntik: 1 Pcs = 1 Pcs
      {
        uuid: konversiJarumSuntikPcsUuid,
        faskes_uuid: faskesUuid,
        item_medis_uuid: itemJarumSuntikUuid,
        satuan_pembelian_uuid: satuanPenggunaanPcsUuid, // Satuan beli & pakai sama
        satuan_pembelian: "Pieces",
        satuan_penggunaan_uuid: satuanPenggunaanPcsUuid,
        satuan_penggunaan: "Pieces",
        konversi: 1,
        status: true,
      },
    ];

    await ConversionModel.bulkCreate(conversionsToSeed, { transaction });
  }
}
