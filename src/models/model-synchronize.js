import JenisStokModel from "./jenis-stok-model.js";
import AturanPakaiModel from "./aturan-pakai-model.js";
import BentukRacikanModel from "./bentuk-racikan-model.js";
import BentukSediaanModel from "./bentuk-sediaan-model.js";
import CaraiPakaiModel from "./cara-pakai-model.js";
import ConversionModel from "./conversion-model.js";
import IngredientItemMedisModel from "./ingredient-item-medis-model.js";
import IngredientModel from "./ingredient-model.js";
import ItemMedisModel from "./item-medis-model.js";
import ItemPenjualanObatModel from "./item-penjualan-obat-model.js";
import KategoriObatModel from "./kategori-obat-model.js";
import KonfigurasiHargaModel from "./konfigurasi-harga-model.js";
import LokasiStokModel from "./lokasi-stok-model.js";
import ManufactureModel from "./manufacture-model.js";
import OrderAlkesItemModel from "./order-alkes-item-model.js";
import OrderAlkesModel from "./order-alkes-model.js";
import PenjualanObatModel from "./penjualan-obat-model.js";
import PrescriptionItemModel from "./prescription-item-model.js";
import PrescriptionItemRacikanModel from "./prescription-item-racikan-model.js";
import PrescriptionModel from "./prescription-model.js";
import ReturItemModel from "./retur-item-model.js";
import ReturModel from "./retur-model.js";
import SatuanModel from "./satuan-model.js";
import StockMedisModel from "./stock-medis-model.js";
import HargaItemModel from "./harga-item-model.js";
import ItemMedisJenisStokModel from "./item-medis-jenis-stok-model.js";
import PatientModel from "./patient-model.js";
import {JenisStokItemMedisModel} from "@adameds/model-sdk/farmasi";
import FpoPemberianModel from "./fpo-pemberian-model.js";

const MODELMERGE = [
    // JenisStokModel,
    // AturanPakaiModel,
    // BentukRacikanModel,
    // BentukSediaanModel,
    // CaraiPakaiModel,
    // ConversionModel,
    // IngredientItemMedisModel,
    // IngredientModel,
    // ItemMedisModel,
    // ItemPenjualanObatModel,
    // JenisStokItemMedisModel,
    // KategoriObatModel,
    // KonfigurasiHargaModel,
    // LokasiStokModel,
    // ManufactureModel,
    OrderAlkesItemModel,
    OrderAlkesModel,
    // PatientModel,
    // PenjualanObatModel,
    PrescriptionItemModel,
    // PrescriptionItemRacikanModel,
    // PrescriptionModel,
    // ReturItemModel,
    // ReturModel,
    // SatuanModel,
    // StockMedisModel,
    // HargaItemModel,
    // ItemMedisJenisStokModel,
    // JenisStokModel,
    // ItemMedisModel,
    // LokasiStokModel
    FpoPemberianModel
];

export default MODELMERGE;