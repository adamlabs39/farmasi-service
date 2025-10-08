import { v7 as uuidv7 } from "uuid";
import { ItemMedisModel } from "@adameds/model-sdk/farmasi";

// 1. IMPOR UUID dari seeder data master
import {
  bentukSediaanTabletUuid,
  bentukSediaanAlkesUuid,
} from "./bentuk-sediaan-seeder.js";
import {
  kategoriObatAnalgesikUuid,
  kategoriObatAntibiotikUuid,
  kategoriObatAlkesUuid,
} from "./kategori-obat-seeder.js";
import { satuanDosisMgUuid, satuanPenggunaanPcsUuid } from "./satuan-seeder.js";

// 2. EKSPOR UUID miliknya sendiri untuk digunakan seeder lain
export const itemParacetamolUuid = uuidv7();
export const itemAmoxicillinUuid = uuidv7();
export const itemJarumSuntikUuid = uuidv7();

export default class ItemMedisSeeder {
  static async seed(transaction) {
    await ItemMedisModel.destroy({
      where: {},
      truncate: true,
      cascade: true,
      transaction,
    });

    const faskesUuid = "01981726-d5cf-7bc4-97ca-9804168283f7";

    const itemsToSeed = [
      {
        uuid: itemParacetamolUuid, // Gunakan UUID dinamis yang diekspor
        faskes_uuid: faskesUuid,
        code: "PCT500",
        name: "Paracetamol 500mg",
        bentuk_sediaan_uuid: bentukSediaanTabletUuid, // Gunakan UUID yang diimpor
        dosis: 500,
        satuan_dosis_uuid: satuanDosisMgUuid, // Gunakan UUID yang diimpor
        satuan_penggunaan_uuid: satuanPenggunaanPcsUuid, // Gunakan UUID yang diimpor
        jenis_item: "obat",
        kategori_obat_uuid: kategoriObatAnalgesikUuid, // Gunakan UUID yang diimpor
        status: true,
      },
      {
        uuid: itemAmoxicillinUuid, // Gunakan UUID dinamis yang diekspor
        faskes_uuid: faskesUuid,
        code: "AMX500",
        name: "Amoxicillin 500mg",
        bentuk_sediaan_uuid: bentukSediaanTabletUuid,
        dosis: 500,
        satuan_dosis_uuid: satuanDosisMgUuid,
        satuan_penggunaan_uuid: satuanPenggunaanPcsUuid,
        jenis_item: "obat",
        kategori_obat_uuid: kategoriObatAntibiotikUuid,
        status: true,
      },
      {
        uuid: itemJarumSuntikUuid, // Gunakan UUID dinamis yang diekspor
        faskes_uuid: faskesUuid,
        code: "JRM-3ML",
        name: "Jarum Suntik 3ml",
        bentuk_sediaan_uuid: bentukSediaanAlkesUuid,
        dosis: 0,
        satuan_dosis_uuid: satuanPenggunaanPcsUuid,
        satuan_penggunaan_uuid: satuanPenggunaanPcsUuid,
        jenis_item: "alkes",
        kategori_obat_uuid: kategoriObatAlkesUuid,
        status: true,
      },
    ];

    await ItemMedisModel.bulkCreate(itemsToSeed, { transaction });
  }
}
