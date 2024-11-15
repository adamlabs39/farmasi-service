import {ReturItemModel, ReturModel} from "@adameds/model-sdk/farmasi";

export default class ReturRepository {
    static async create(req, transaction) {
        return await ReturModel.create(req, {transaction});
    }

    static async createItem(req, transaction) {
        return await ReturItemModel.create(req, {transaction});
    }
}