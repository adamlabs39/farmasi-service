import express from "express";
import SatuanController from "../controllers/datamaster-satuan-controller.js";

const apiBase = process.env.API_BASE || "api";
const apiVersion = process.env.API_VERSION || "v1";
const baseUrl = `/${apiBase}/${apiVersion}/farmasi`;

const routes = express.Router();

// HEALTH CHECK
routes.get(`${baseUrl}/health`, (req, res) => res.status(200).json({ message: "OK" }));

// DATAMASTTER - SATUAN
routes.post(`${baseUrl}/datamaster/satuan`, SatuanController.create);
routes.get(`${baseUrl}/datamaster/satuan`, SatuanController.getAll);
routes.put(`${baseUrl}/datamaster/satuan/:uuid`, SatuanController.update);
routes.delete(`${baseUrl}/datamaster/satuan`, SatuanController.delete);

export default routes;