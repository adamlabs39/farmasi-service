import successResponse from "../responses/success-response.js";
import ReturService from "../services/retur-service.js";

export default class ReturController {
  static async create(req, res, nextFunction) {
    try {
      req.body.faskes_uuid = req.author.faskesUuid;
      req.body.petugas_retur = req.author.username;

      req.body.token = req.get("Authorization");

      await ReturService.create(req.body);

      res.status(200).json(successResponse("data berhasil diretur"));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getDetail(req, res, nextFunction) {
    try {
      const result = await ReturService.getDetail(req.query);
      res
        .status(200)
        .json(successResponse("Data berhasil ditampilkan", result));
    } catch (error) {
      nextFunction(error);
    }
  }

  static async getAll(req, res, nextFunction) {
    try {
      req.query.faskes_uuid = req.author.faskesUuid;
      const result = await ReturService.getAll(req.query);
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
}
