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
import {LokasiModel} from "@adameds/model-sdk/datamaster";
import {StockMedisModel} from "@adameds/model-sdk/inventory";
import {PatientModel} from "@adameds/model-sdk/admisi";

function JenisStokItemMedisModel() {
    return undefined;
}

const MODELMERGE = [
    JenisStokModel,
    AturanPakaiModel,
    BentukRacikanModel,
    BentukSediaanModel,
    CaraiPakaiModel,
    ConversionModel,
    IngredientItemMedisModel,
    IngredientModel,
    ItemMedisModel,
    ItemPenjualanObatModel,
    JenisStokItemMedisModel,
    KategoriObatModel,
    KonfigurasiHargaModel,
    LokasiStokModel,
    ManufactureModel,
    OrderAlkesItemModel,
    OrderAlkesModel,
    PatientModel,
    PenjualanObatModel,
    PrescriptionItemModel,
    PrescriptionItemRacikanModel,
    PrescriptionModel,
    ReturItemModel,
    ReturModel,
    SatuanModel,
    StockMedisModel,
    HargaItemModel,
    ItemMedisJenisStokModel,
    FpoPemberianModel,
    LokasiModel
];

export default MODELMERGE;