import LokasiStokSeeder from "./lokasi-stok-seeder.js";
import AturanPakaiSeeder from "./aturan-pakai-seeder.js";
import ItemMedisSeeder from "./item-medis-seeder.js";
import SatuanSeeder from "./satuan-seeder.js";
import PrescriptionItemSeeder from "./prescription-item-seeder.js";
import PrescriptionItemRacikanSeeder from "./prescription-item-racikan-seeder.js";
import HargaItemSeeder from "./harga-item-seeder.js";
import JenisStokSeeder from "./jenis-stok-seeder.js";
import ItemMedisJenisStokSeeder from "./item-medis-jenis-stok-seeder.js";
import CaraPakaiSeeder from "./cara-pakai-seeder.js";
import OrderAlkesSeeder from "./order-alkes-seeder.js";
import OrderAlkesItemSeeder from "./order-alkes-item-seeder.js";
import FpoPemberianSeeder from "./fpo-pemberian-seeder.js";
import PrescriptionSeeder from "./prescription-seeder.js";
import KonfigurasiHargaSeeder from "./konfigurasi-harga-seeder.js";
import FaskesSeeder from "./faskes-seeder.js";
import PegawaiSeeder from "./pegawai-seeder.js";
import PractitionerSeeder from "./practitioner-seeder.js";
import UserSeeder from "./user-seeder.js";
import RoleSeeder from "./role-seeder.js";
import sequelizeInstance from "@adameds/model-sdk/instance";
import BentukSediaanSeeder from "./bentuk-sediaan-seeder.js";
import KategoriObatSeeder from "./kategori-obat-seeder.js";
import ManufacureSeeder from "./manufacure-seeder.js";
import StokMedisSeeder from "./stok-medis-seeder.js";
import LokasiSeeder from "./lokasi-seeder.js";
import BentukRacikanSeeder from "./bentuk-racikan-seeder.js";
import PatientSeeder from "./patient-seeder.js";
import PenjualanObatSeeder from "./penjualan-obat-seeder.js";
import RiwayatSeeder from "./riwayat-seeder.js";

export const dbSeeder = async () => {
    const transaction = await sequelizeInstance.transaction();
    try {
        // user things
        // await RoleSeeder.seed(transaction);
        // await FaskesSeeder.seed(transaction);
        // await PegawaiSeeder.seed(transaction);
        // await PractitionerSeeder.seed(transaction);
        // await UserSeeder.seed(transaction);
        // await PatientSeeder.seed(transaction);

        // datamaster things
        // await KonfigurasiHargaSeeder.seed(transaction);
        // await AturanPakaiSeeder.seed(transaction);
        // await CaraPakaiSeeder.seed(transaction);
        // await LokasiStokSeeder.seed(transaction);
        // await ItemMedisSeeder.seed(transaction);
        // await SatuanSeeder.seed(transaction);
        // await BentukSediaanSeeder.seed(transaction);
        // await KategoriObatSeeder.seed(transaction);
        // await ManufacureSeeder.seed(transaction);
        // await JenisStokSeeder.seed(transaction);
        // await ItemMedisJenisStokSeeder.seed(transaction);

        // prescription things
        // await LokasiSeeder.seed(transaction);
        // await PrescriptionSeeder.seed(transaction);
        // await PrescriptionItemSeeder.seed(transaction);
        // await PrescriptionItemRacikanSeeder.seed(transaction);
        // await BentukRacikanSeeder.seed(transaction);
        // await StokMedisSeeder.seed(transaction);
        // await HargaItemSeeder.seed(transaction);
        await RiwayatSeeder.seed(transaction);

        // PENJUALAN OBAT
        // await PenjualanObatSeeder.seed(transaction);

        // FARMASI RUANGAN
        // await OrderAlkesSeeder.seed(transaction);
        // await OrderAlkesItemSeeder.seed(transaction);

        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};