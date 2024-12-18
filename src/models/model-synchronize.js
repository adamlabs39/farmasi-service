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
    PrescriptionItemRacikanModel,
    ReturItemModel,
    ReturModel,
    SatuanModel
} from "@adameds/model-sdk/farmasi";
import PrescriptionModel from "./prescription-model.js";
import {
    FaskesModel,
    LokasiModel,
    PegawaiModel,
    PractitionerModel,
    RoleModel,
    UserModel
} from "@adameds/model-sdk/datamaster";
import {StockMedisModel} from "@adameds/model-sdk/inventory";
import {PatientModel} from "@adameds/model-sdk/admisi";
import PractitionerSeeder from "../seeders/practitioner-seeder.js";

function JenisStokItemMedisModel() {
    return undefined;
}

const MODELMERGE = [
    // RoleModel,
    // FaskesModel,
    // PegawaiModel,
    // PractitionerModel,
    // UserModel,
    PatientModel,

    KonfigurasiHargaModel,
    AturanPakaiModel,
    CaraiPakaiModel,
    LokasiStokModel,
    ItemMedisModel,
    SatuanModel,
    BentukSediaanModel,
    KategoriObatModel,
    ManufactureModel,
    JenisStokModel,
    ItemMedisJenisStokModel,

    LokasiModel,
    PrescriptionModel,
    PrescriptionItemModel,
    PrescriptionItemRacikanModel,
    BentukRacikanModel,
    StockMedisModel,
    HargaItemModel,

    PenjualanObatModel,
    ItemPenjualanObatModel,

    OrderAlkesModel,
    OrderAlkesItemModel
];

export default MODELMERGE;