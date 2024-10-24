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

// DATAMASTER - BENTUK SEDIAAN
routes.post(`${baseUrl}/datamaster/bentuk-sediaan`, DatamasterBentukSediaanController.create);
routes.get(`${baseUrl}/datamaster/bentuk-sediaan`, DatamasterBentukSediaanController.getAll);
routes.put(`${baseUrl}/datamaster/bentuk-sediaan/:uuid`, DatamasterBentukSediaanController.update);
routes.delete(`${baseUrl}/datamaster/bentuk-sediaan/:uuid`, DatamasterBentukSediaanController.delete);

// DATAMASTER - KATEGORI OBAT
routes.post(`${baseUrl}/datamaster/kategori-obat`, DatamasterKategoriObatController.create);
routes.get(`${baseUrl}/datamaster/kategori-obat`, DatamasterKategoriObatController.getAll);
routes.put(`${baseUrl}/datamaster/kategori-obat/:uuid`, DatamasterKategoriObatController.update);
routes.delete(`${baseUrl}/datamaster/kategori-obat/:uuid`, DatamasterKategoriObatController.delete);

// DATAMASTER - MANUFACTURE
routes.post(`${baseUrl}/datamaster/manufacture`, DatamasterManufactureController.create);
routes.get(`${baseUrl}/datamaster/manufacture`, DatamasterManufactureController.getAll);
routes.put(`${baseUrl}/datamaster/manufacture/:uuid`, DatamasterManufactureController.update);
routes.delete(`${baseUrl}/datamaster/manufacture/:uuid`, DatamasterManufactureController.delete);

// DATAMASTER - CARA PAKAI
routes.post(`${baseUrl}/datamaster/cara-pakai`, DatamasterCaraPakaiController.create);
routes.get(`${baseUrl}/datamaster/cara-pakai`, DatamasterCaraPakaiController.getAll);
routes.put(`${baseUrl}/datamaster/cara-pakai/:uuid`, DatamasterCaraPakaiController.update);
routes.delete(`${baseUrl}/datamaster/cara-pakai/:uuid`, DatamasterCaraPakaiController.delete);

// DATAMASTER - JENIS STOK
routes.post(`${baseUrl}/datamaster/jenis-stok`, DatamasterJenisStokController.create);
routes.get(`${baseUrl}/datamaster/jenis-stok`, DatamasterJenisStokController.getAll);
routes.put(`${baseUrl}/datamaster/jenis-stok/:uuid`, DatamasterJenisStokController.update);
routes.delete(`${baseUrl}/datamaster/jenis-stok/:uuid`, DatamasterJenisStokController.delete);

// DATAMASTER - LOKASI STOK
routes.post(`${baseUrl}/datamaster/lokasi-stok`, DatamasterLokasiStokController.create);
routes.get(`${baseUrl}/datamaster/lokasi-stok`, DatamasterLokasiStokController.getAll);
routes.put(`${baseUrl}/datamaster/lokasi-stok/:uuid`, DatamasterLokasiStokController.update);
routes.delete(`${baseUrl}/datamaster/lokasi-stok/:uuid`, DatamasterLokasiStokController.delete);

// DATAMASTER - ATURAN PAKAI
routes.post(`${baseUrl}/datamaster/aturan-pakai`, DatamasterAturanPakaiController.create);
routes.get(`${baseUrl}/datamaster/aturan-pakai`, DatamasterAturanPakaiController.getAll);
routes.put(`${baseUrl}/datamaster/aturan-pakai/:uuid`, DatamasterAturanPakaiController.update);
routes.delete(`${baseUrl}/datamaster/aturan-pakai/:uuid`, DatamasterAturanPakaiController.delete);

// DATAMASTER - INGREDIENT
routes.post(`${baseUrl}/datamaster/ingredient`, DatamasterIngredientController.create);
routes.get(`${baseUrl}/datamaster/ingredient`, DatamasterIngredientController.getAll);
routes.put(`${baseUrl}/datamaster/ingredient/:uuid`, DatamasterIngredientController.update);
routes.delete(`${baseUrl}/datamaster/ingredient/:uuid`, DatamasterIngredientController.delete);

// DATAMASTER - BENTUK RACIKAN
routes.post(`${baseUrl}/datamaster/bentuk-racikan`, DatamasterBentukRacikanController.create);
routes.get(`${baseUrl}/datamaster/bentuk-racikan`, DatamasterBentukRacikanController.getAll);
routes.put(`${baseUrl}/datamaster/bentuk-racikan/:uuid`, DatamasterBentukRacikanController.update);
routes.delete(`${baseUrl}/datamaster/bentuk-racikan/:uuid`, DatamasterBentukRacikanController.delete);

// DATAMASTER - ITEM MEDIS
routes.post(`${baseUrl}/datamaster/item-medis`, DatamasterItemMedisController.create);
routes.put(`${baseUrl}/datamaster/item-medis/:uuid`, DatamasterItemMedisController.update);
routes.get(`${baseUrl}/datamaster/item-medis`, DatamasterItemMedisController.getAll);
routes.delete(`${baseUrl}/datamaster/item-medis/:uuid`, DatamasterItemMedisController.delete);
routes.get(`${baseUrl}/datamaster/item-medis/:uuid/conversions`, DatamasterItemMedisController.getConversions);
routes.get(`${baseUrl}/datamaster/item-medis/without-pagination`, DatamasterItemMedisController.getAllWithoutPagination);

// KONFIGURASI HARGA
routes.get(`${baseUrl}/datamaster/konfig-harga`, KonfigurasiHargaController.get);
routes.put(`${baseUrl}/datamaster/konfig-harga`, KonfigurasiHargaController.update);

// ORDER OBAT
routes.post(`${baseUrl}/prescriptions/first-order`, PrescriptionController.orderObat);
routes.post(`${baseUrl}/prescriptions/add-obat`, PrescriptionController.addObat);
routes.delete(`${baseUrl}/prescriptions/obat/:prescription_uuid`, PrescriptionController.deleteObat);
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

export default routes;