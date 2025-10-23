import successResponse from "../responses/success-response.js";
import PenjualanObatService from "../services/penjualan-obat-service.js";

export default class PenjualanObatController {
  static async create(req, res, nextFunction) {
    try {
      const token = req.headers.authorization;
      const author = req.author;
      const data = req.body;
      const result = await PenjualanObatService.create(data, author, token);

      res.status(200).json(successResponse("Data berhasil disimpan"));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async batalOtc(req, res, nextFunction) {
    try {
      const { uuid } = req.params;
      req.body.uuid = uuid;
      req.body.token = req.get("Authorization");

      const result = await PenjualanObatService.batalOtc(req.body);

      res.status(200).json(successResponse("data berhasil dibatalkan", result));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getAll(req, res, nextFunction) {
    try {
      req.query.faskes_uuid = req.author.faskesUuid;

      const result = await PenjualanObatService.getAll(req.query);
      res
        .status(200)
        .json(
          successResponse(
            "Data berhasil ditampilkan",
            result.data,
            result.pagination
          )
        );
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getDetail(req, res, nextFunction) {
    try {
      const { uuid } = req.params;
      req.query.uuid = uuid;

      const result = await PenjualanObatService.getByUuid(req.query);
      res
        .status(200)
        .json(successResponse("Data berhasil ditampilkan", result));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getCode(req, res, nextFunction) {
    try {
      req.query.faskes_uuid = req.author.faskesUuid;
      const result = await PenjualanObatService.generateCode(req.query);
      res
        .status(200)
        .json(successResponse("Data berhasil ditampilkan", result));
    } catch (error) {
      nextFunction(error);
    }
  }
}
