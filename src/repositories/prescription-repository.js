import PrescriptionModel from "../models/prescription-model.js";
import PrescriptionItemModel from "../models/prescription-item-model.js";
import PrescriptionItemRacikanModel from "../models/prescription-item-racikan-model.js";

export default class PrescriptionRepository {
    // create prescription
    static async createPrescription(req, transaction) {
        return await PrescriptionModel.create(req, {transaction});
    }

    // create prescription item
    static async createPrescriptionItem(req, transaction) {
        return await PrescriptionItemModel.create(req, {transaction});
    }

    // create prescription item racikan
    static async createPrescriptionItemRacikan(req, transaction) {
        return await PrescriptionItemRacikanModel.create(req, transaction);
    }

    // get all prescription
    static async getAllPrescription(faskes_uuid) {
        return await PrescriptionModel.findAll(
            {
                where: {
                    faskes_uuid: faskes_uuid
                }
            }
        );
    }

    // get all prescription item
    static async getAllPrescriptionItem(prescription_uuid) {
        return await PrescriptionItemModel.findAll(
            {
                where: {
                    prescription_uuid: prescription_uuid
                }
            }
        );
    }

    // get all prescription item racikan
    static async getAllPrescriptionItemRacikan(prescription_item_uuid) {
        return await PrescriptionItemRacikanModel.findAll(
            {
                where: {
                    prescription_item_uuid: prescription_item_uuid
                }
            }
        );
    }

    // delete prescription item
    static async deletePrescriptionItem(prescription_item_uuid) {
        return await PrescriptionItemModel.destroy(
            {
                where: {
                    uuid: prescription_item_uuid
                }
            }
        );
    }

    // delete prescription item racikan
    static async deletePrescriptionItemRacikan(prescription_item_racikan_uuid) {
        return await PrescriptionItemRacikanModel.destroy(
            {
                where: {
                    uuid: prescription_item_racikan_uuid
                }
            }
        );
    }

    // edit prescription
    static async editPrescription(req) {
        return await PrescriptionModel.update(
            req,
            {
                where: {
                    uuid: req.uuid
                }
            }
        );
    }

    // edit prescription item racikan
    static async editPrescriptionItemRacikan(req) {
        return await PrescriptionItemRacikanModel.update(
            req,
            {
                where: {
                    uuid: req.uuid
                }
            }
        );
    }

    // edit prescription item
    static async editPrescriptionItem(req) {
        return await PrescriptionItemModel.update(
            req,
            {
                where: {
                    uuid: req.uuid
                }
            }
        );
    }
}