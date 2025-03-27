import express from "express";
import DatamasterSatuanController from "../controllers/datamaster-satuan-controller.js";
import DatamasterBentukSediaanController from "../controllers/datamaster-bentuk-sediaan-controller.js";
import DatamasterKategoriObatController from "../controllers/datamaster-kategori-obat-controller.js";
import DatamasterManufactureController from "../controllers/datamaster-manufacture-controller.js";
import DatamasterCaraPakaiController from "../controllers/datamaster-cara-pakai-controller.js";
import DatamasterJenisStokController from "../controllers/datamaster-jenis-stok-controller.js";
import DatamasterLokasiStokController from "../controllers/datamaster-lokasi-stok-controller.js";
import DatamasterAturanPakaiController from "../controllers/datamaster-aturan-pakai-controller.js";
import DatamasterIngredientController from "../controllers/datamaster-ingredient-controller.js";
import KonfigurasiHargaController from "../controllers/konfigurasi-harga-controller.js";
import DatamasterBentukRacikanController from "../controllers/datamaster-bentuk-racikan-controller.js";
import DatamasterItemMedisController from "../controllers/datamaster-item-medis-controller.js";
import PrescriptionController from "../controllers/prescription-controller.js";
import PenjualanObatController from "../controllers/penjualan-obat-controller.js";
import AlkesController from "../controllers/alkes-controller.js";
import ReturController from "../controllers/retur-controller.js";
import RiwayatController from "../controllers/riwayat-controller.js";
import ReportController from "../controllers/report-controller.js";

const apiBase = process.env.API_BASE || "api";
const apiVersion = process.env.API_VERSION || "v1";
const baseUrl = `/${apiBase}/${apiVersion}/farmasi`;

const routes = express.Router();

// HEALTH CHECK
routes.get(`${baseUrl}/health`, (req, res) => res.status(200).json({ message: "OK" }));

// DATAMASTTER - SATUAN
routes.post(`${baseUrl}/datamaster/satuan`, DatamasterSatuanController.create);
routes.get(`${baseUrl}/datamaster/satuan`, DatamasterSatuanController.getAll);
routes.put(`${baseUrl}/datamaster/satuan/:uuid`, DatamasterSatuanController.update);
routes.delete(`${baseUrl}/datamaster/satuan/:uuid`, DatamasterSatuanController.delete);
routes.post(`${baseUrl}/datamaster/satuan/import`, DatamasterSatuanController.import);
routes.get(`${baseUrl}/datamaster/satuan/export`, DatamasterSatuanController.getAll);

// DATAMASTER - BENTUK SEDIAAN
routes.post(`${baseUrl}/datamaster/bentuk-sediaan`, DatamasterBentukSediaanController.create);
routes.get(`${baseUrl}/datamaster/bentuk-sediaan`, DatamasterBentukSediaanController.getAll);
routes.put(`${baseUrl}/datamaster/bentuk-sediaan/:uuid`, DatamasterBentukSediaanController.update);
routes.delete(`${baseUrl}/datamaster/bentuk-sediaan/:uuid`, DatamasterBentukSediaanController.delete);
routes.post(`${baseUrl}/datamaster/bentuk-sediaan/import`, DatamasterBentukSediaanController.import);
routes.get(`${baseUrl}/datamaster/bentuk-sediaan/export`, DatamasterBentukSediaanController.getAll);


// DATAMASTER - KATEGORI OBAT
routes.post(`${baseUrl}/datamaster/kategori-obat`, DatamasterKategoriObatController.create);
routes.get(`${baseUrl}/datamaster/kategori-obat`, DatamasterKategoriObatController.getAll);
routes.put(`${baseUrl}/datamaster/kategori-obat/:uuid`, DatamasterKategoriObatController.update);
routes.delete(`${baseUrl}/datamaster/kategori-obat/:uuid`, DatamasterKategoriObatController.delete);
routes.post(`${baseUrl}/datamaster/kategori-obat/import`, DatamasterKategoriObatController.import);
routes.get(`${baseUrl}/datamaster/kategori-obat/export`, DatamasterKategoriObatController.getAll);

// DATAMASTER - MANUFACTURE
routes.post(`${baseUrl}/datamaster/manufacture`, DatamasterManufactureController.create);
routes.get(`${baseUrl}/datamaster/manufacture`, DatamasterManufactureController.getAll);
routes.put(`${baseUrl}/datamaster/manufacture/:uuid`, DatamasterManufactureController.update);
routes.delete(`${baseUrl}/datamaster/manufacture/:uuid`, DatamasterManufactureController.delete);
routes.post(`${baseUrl}/datamaster/manufacture/import`, DatamasterManufactureController.import);
routes.get(`${baseUrl}/datamaster/manufacture/export`, DatamasterManufactureController.export);

// DATAMASTER - CARA PAKAI
routes.post(`${baseUrl}/datamaster/cara-pakai`, DatamasterCaraPakaiController.create);
routes.get(`${baseUrl}/datamaster/cara-pakai`, DatamasterCaraPakaiController.getAll);
routes.put(`${baseUrl}/datamaster/cara-pakai/:uuid`, DatamasterCaraPakaiController.update);
routes.delete(`${baseUrl}/datamaster/cara-pakai/:uuid`, DatamasterCaraPakaiController.delete);
routes.post(`${baseUrl}/datamaster/cara-pakai/import`, DatamasterCaraPakaiController.import);
routes.get(`${baseUrl}/datamaster/cara-pakai/export`, DatamasterCaraPakaiController.getAll);

// DATAMASTER - JENIS STOK
routes.post(`${baseUrl}/datamaster/jenis-stok`, DatamasterJenisStokController.create);
routes.get(`${baseUrl}/datamaster/jenis-stok`, DatamasterJenisStokController.getAll);
routes.put(`${baseUrl}/datamaster/jenis-stok/:uuid`, DatamasterJenisStokController.update);
routes.delete(`${baseUrl}/datamaster/jenis-stok/:uuid`, DatamasterJenisStokController.delete);
routes.post(`${baseUrl}/datamaster/jenis-stok/import`, DatamasterJenisStokController.import);
routes.get(`${baseUrl}/datamaster/jenis-stok/export`, DatamasterJenisStokController.getAll);

// DATAMASTER - LOKASI STOK
routes.post(`${baseUrl}/datamaster/lokasi-stok`, DatamasterLokasiStokController.create);
routes.get(`${baseUrl}/datamaster/lokasi-stok`, DatamasterLokasiStokController.getAll);
routes.put(`${baseUrl}/datamaster/lokasi-stok/:uuid`, DatamasterLokasiStokController.update);
routes.delete(`${baseUrl}/datamaster/lokasi-stok/:uuid`, DatamasterLokasiStokController.delete);
routes.post(`${baseUrl}/datamaster/lokasi-stok/import`, DatamasterLokasiStokController.import);
routes.get(`${baseUrl}/datamaster/lokasi-stok/export`, DatamasterLokasiStokController.export);

// DATAMASTER - ATURAN PAKAI
routes.post(`${baseUrl}/datamaster/aturan-pakai`, DatamasterAturanPakaiController.create);
routes.get(`${baseUrl}/datamaster/aturan-pakai`, DatamasterAturanPakaiController.getAll);
routes.put(`${baseUrl}/datamaster/aturan-pakai/:uuid`, DatamasterAturanPakaiController.update);
routes.delete(`${baseUrl}/datamaster/aturan-pakai/:uuid`, DatamasterAturanPakaiController.delete);
routes.post(`${baseUrl}/datamaster/aturan-pakai/import`, DatamasterAturanPakaiController.import);
routes.get(`${baseUrl}/datamaster/aturan-pakai/export`, DatamasterAturanPakaiController.getAll);

// DATAMASTER - INGREDIENT
routes.post(`${baseUrl}/datamaster/ingredient`, DatamasterIngredientController.create);
routes.get(`${baseUrl}/datamaster/ingredient`, DatamasterIngredientController.getAll);
routes.put(`${baseUrl}/datamaster/ingredient/:uuid`, DatamasterIngredientController.update);
routes.delete(`${baseUrl}/datamaster/ingredient/:uuid`, DatamasterIngredientController.delete);
routes.post(`${baseUrl}/datamaster/ingredient/import`, DatamasterIngredientController.import);
routes.get(`${baseUrl}/datamaster/ingredient/export`, DatamasterIngredientController.getAll);

// DATAMASTER - BENTUK RACIKAN
routes.post(`${baseUrl}/datamaster/bentuk-racikan`, DatamasterBentukRacikanController.create);
routes.get(`${baseUrl}/datamaster/bentuk-racikan`, DatamasterBentukRacikanController.getAll);
routes.put(`${baseUrl}/datamaster/bentuk-racikan/:uuid`, DatamasterBentukRacikanController.update);
routes.delete(`${baseUrl}/datamaster/bentuk-racikan/:uuid`, DatamasterBentukRacikanController.delete);

// DATAMASTER - ITEM MEDIS
routes.post(`${baseUrl}/datamaster/item-medis`, DatamasterItemMedisController.create);
routes.put(`${baseUrl}/datamaster/item-medis/:uuid`, DatamasterItemMedisController.update);
routes.post(`${baseUrl}/datamaster/item-medis/all`, DatamasterItemMedisController.getAll);
routes.get(`${baseUrl}/datamaster/item-medis/export`, DatamasterItemMedisController.export);
routes.get(`${baseUrl}/datamaster/item-medis/pengadaan`, DatamasterItemMedisController.getForPengadaan);
routes.post(`${baseUrl}/datamaster/item-medis/import`, DatamasterItemMedisController.import);
routes.delete(`${baseUrl}/datamaster/item-medis/:uuid`, DatamasterItemMedisController.delete);
routes.get(`${baseUrl}/datamaster/item-medis/:uuid/conversions`, DatamasterItemMedisController.getConversions);
routes.get(`${baseUrl}/datamaster/item-medis/without-pagination`, DatamasterItemMedisController.getAllWithoutPagination);
routes.get(`${baseUrl}/datamaster/item-medis/available-jenis-stock/:uuid`, DatamasterItemMedisController.getAvailableJenisStok);

// KONFIGURASI HARGA
routes.get(`${baseUrl}/datamaster/konfig-harga`, KonfigurasiHargaController.get);
routes.put(`${baseUrl}/datamaster/konfig-harga`, KonfigurasiHargaController.update);

// ORDER OBAT
routes.post(`${baseUrl}/prescriptions/first-order`, PrescriptionController.orderObat);
routes.post(`${baseUrl}/prescriptions/add-obat`, PrescriptionController.addObat);
routes.delete(`${baseUrl}/prescriptions/obat/:prescription_item_uuid`, PrescriptionController.deleteObat);
routes.get(`${baseUrl}/prescriptions/fpo`, PrescriptionController.getForFpo);
routes.get(`${baseUrl}/prescriptions/:uuid`, PrescriptionController.getByUuid);
routes.put(`${baseUrl}/prescriptions/:uuid`, PrescriptionController.updatePrescription);
routes.put(`${baseUrl}/prescriptions/obat/:uuid`, PrescriptionController.updateObat);
routes.get(`${baseUrl}/prescriptions/obat/history`, PrescriptionController.getHistoryObat);
routes.post(`${baseUrl}/prescriptions/some-order`, PrescriptionController.getOrderBySomeUuid);
routes.post(`${baseUrl}/prescriptions/status-telaah`, PrescriptionController.updateTelaah);
routes.post(`${baseUrl}/prescriptions/batal-order`, PrescriptionController.batalOrder);
routes.post(`${baseUrl}/prescriptions/status-siap-diserahkan`, PrescriptionController.updateSiapDiserahkan);
routes.post(`${baseUrl}/prescriptions/status-verifikasi`, PrescriptionController.updateVerifikasi);
routes.post(`${baseUrl}/prescriptions/status-diserahkan`, PrescriptionController.updateDiserahkan);
routes.post(`${baseUrl}/prescriptions/batal-siap-diserahkan`, PrescriptionController.batalSiapDiserahkan);
routes.post(`${baseUrl}/prescriptions/lokasi-stok`, PrescriptionController.updateLokasiStok);
routes.post(`${baseUrl}/prescriptions/all`, PrescriptionController.getAll);
routes.put(`${baseUrl}/prescriptions/obat/:uuid/jenis-stok`, PrescriptionController.updateJenisStokItem);

// PENJUALAN OBAT
routes.post(`${baseUrl}/penjualan-obat`, PenjualanObatController.create);
routes.delete(`${baseUrl}/penjualan-obat/:uuid`, PenjualanObatController.batalOtc);
routes.get(`${baseUrl}/penjualan-obat`, PenjualanObatController.getAll);
routes.get(`${baseUrl}/penjualan-obat/code`, PenjualanObatController.getCode);
routes.get(`${baseUrl}/penjualan-obat/:uuid`, PenjualanObatController.getDetail);

// ALKES
routes.post(`${baseUrl}/alkes`, AlkesController.orderAlkes);
routes.get(`${baseUrl}/alkes/some-order`, AlkesController.getOrderByRekamMedis);
routes.post(`${baseUrl}/alkes/all`, AlkesController.getAllForFarmacy);
routes.put(`${baseUrl}/alkes/lokasi-stok`, AlkesController.updateLokasiStok);
routes.put(`${baseUrl}/alkes/update-verifikasi`, AlkesController.updateVerifikasi);
routes.put(`${baseUrl}/alkes/siap-diserahkan`, AlkesController.updateSiapDiserahkan);
routes.put(`${baseUrl}/alkes/diserahkan`, AlkesController.updateDiserahkan);
routes.put(`${baseUrl}/alkes/batal-siap-diserahkan`, AlkesController.batalSiapDiserahkan);
routes.post(`${baseUrl}/alkes/:uuid/items`, AlkesController.addAlkesItems);
routes.get(`${baseUrl}/alkes/:uuid`, AlkesController.getByUuid);
routes.delete(`${baseUrl}/alkes/items/:alkes_item_uuid`, AlkesController.deleteAlkesItem);
routes.put(`${baseUrl}/alkes/:uuid`, AlkesController.updateAlkes);
routes.put(`${baseUrl}/alkes/items/:uuid`, AlkesController.updateAlkesItem);
routes.put(`${baseUrl}/alkes/items/:uuid/jenis-stok`, AlkesController.updateJenisStokItem);
routes.delete(`${baseUrl}/alkes/:uuid`, AlkesController.batalOrder);

// RETUR
routes.post(`${baseUrl}/retur`, ReturController.create);
routes.get(`${baseUrl}/retur/detail`, ReturController.getDetail);
routes.get(`${baseUrl}/retur/all`, ReturController.getAll);

// RIWAYAT
routes.post(`${baseUrl}/riwayat/all`, RiwayatController.getAll);
routes.post(`${baseUrl}/riwayat/detail`, RiwayatController.getDetail);

// REKAP
routes.get(`${baseUrl}/rekap/pendapatan`, ReportController.getPendapatan);
routes.get(`${baseUrl}/rekap/tat`, ReportController.getTat);
routes.get(`${baseUrl}/rekap/pendapatan-apotik`, ReportController.getPendapatanPerApotik);

// CETAK
routes.get(`${baseUrl}/cetak/e-ticket/:uuid`, PrescriptionController.getEticketData);
routes.get(`${baseUrl}/cetak/e-resep/:uuid`, PrescriptionController.getPrintPrescription);
routes.get(`${baseUrl}/cetak/invoice/:uuid`, PrescriptionController.getForInvoicePrint);

export default routes;