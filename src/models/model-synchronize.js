import {
    AturanPakaiModel, BentukRacikanModel, BentukSediaanModel, CaraiPakaiModel, ConversionModel,
    FpoPemberianModel,
    HargaItemModel, IngredientItemMedisModel, IngredientModel,
    ItemMedisJenisStokModel,
    ItemMedisModel, ItemPenjualanObatModel,
    JenisStokModel, KategoriObatModel, KonfigurasiHargaModel,
    LokasiStokModel,
    ManufactureModel,
    OrderAlkesItemModel,
    OrderAlkesModel,
    PenjualanObatModel,
    PrescriptionItemModel,
    PrescriptionItemRacikanModel, PrescriptionModel,
    ReturItemModel,
    ReturModel,
    SatuanModel
} from "@adameds/model-sdk/farmasi";
import {
    FaskesModel, KabupatenModel, KecamatanModel, KelurahanModel,
    LokasiModel,
    PegawaiModel,
    PractitionerModel, ProvinceModel,
    RoleModel,
    UserModel
} from "@adameds/model-sdk/datamaster";
import {StockMedisModel} from "@adameds/model-sdk/inventory";
import {PatientModel} from "@adameds/model-sdk/admisi";
import PractitionerSeeder from "../seeders/practitioner-seeder.js";
import {InstalasiGawatDaruratModel, RawatInapModel, RawatJalanModel} from "@adameds/model-sdk/pelayanan";
import {AddressModel, FaskesProfilesModel} from "@adameds/model-sdk/setting";
import {OrderFisioModel} from "@adameds/model-sdk/rekam-medis";


const MODELMERGE = [
    // RoleModel,
    // FaskesModel,
    // PegawaiModel,
    // PractitionerModel,
    // UserModel,
    // PatientModel,
    FaskesProfilesModel,
    AddressModel,

    KonfigurasiHargaModel,
    // AturanPakaiModel,
    // CaraiPakaiModel,
    // LokasiStokModel,
    // ItemMedisModel,
    // SatuanModel,
    // BentukSediaanModel,
    // KategoriObatModel,
    JenisStokModel,
    ItemMedisJenisStokModel,
    ConversionModel,
    // IngredientModel,

    // ManufactureModel,
    // ProvinceModel,
    // KabupatenModel,
    // KecamatanModel,
    // KelurahanModel,
    //
    // // LokasiModel,
    PrescriptionModel,
    PrescriptionItemModel,
    PrescriptionItemRacikanModel,
    // BentukRacikanModel,
    StockMedisModel,
    HargaItemModel,
    //
    PenjualanObatModel,
    ItemPenjualanObatModel,
    //
    OrderAlkesModel,
    OrderAlkesItemModel,
    //
    // ReturModel,
    // ReturItemModel,
    //
    RawatJalanModel,
    RawatInapModel,
    InstalasiGawatDaruratModel,
    OrderFisioModel,
    FpoPemberianModel
];

export default MODELMERGE;