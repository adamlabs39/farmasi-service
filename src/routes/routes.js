import express from "express";
import DatamasterSatuanController from "../controllers/datamaster-satuan-controller.js";
import DatamasterBentukSediaanController from "../controllers/datamaster-bentuk-sediaan-controller.js";
import DatamasterKategoriObatController from "../controllers/datamaster-kategori-obat-controller.js";

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
routes.delete(`${baseUrl}/datamaster/satuan`, DatamasterSatuanController.delete);

// DATAMASTER - BENTUK SEDIAAN
routes.post(`${baseUrl}/datamaster/bentuk-sediaan`, DatamasterBentukSediaanController.create);
routes.get(`${baseUrl}/datamaster/bentuk-sediaan`, DatamasterBentukSediaanController.getAll);
routes.put(`${baseUrl}/datamaster/bentuk-sediaan/:uuid`, DatamasterBentukSediaanController.update);
routes.delete(`${baseUrl}/datamaster/bentuk-sediaan`, DatamasterBentukSediaanController.delete);

// DATAMASTER - KATEGORI OBAT
routes.post(`${baseUrl}/datamaster/kategori-obat`, DatamasterKategoriObatController.create);
routes.get(`${baseUrl}/datamaster/kategori-obat`, DatamasterKategoriObatController.getAll);
routes.put(`${baseUrl}/datamaster/kategori-obat/:uuid`, DatamasterKategoriObatController.update);
routes.delete(`${baseUrl}/datamaster/kategori-obat`, DatamasterKategoriObatController.delete);

export default routes;