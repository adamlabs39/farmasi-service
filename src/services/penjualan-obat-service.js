import ZodValidator from "../validations/zod-validator.js";
import PenjualanObatValidation from "../validations/penjualan-obat-validation.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import PenjualanObatRepository from "../repositories/penjualan-obat-repository.js";
import Utils from "../helpers/utils.js";
import {toEpochDate} from "../helpers/date-helper.js";

export default class PenjualanObatService {

    static async create(req) {
        ZodValidator.validate(PenjualanObatValidation.CREATE_OTC, req);
        const transaction = await sequelizeInstance.transaction();

        // create no transaksi
        req.no_transaksi = Utils.generate4Code('OTC');

        req.tanggal_pembelian = toEpochDate(new Date());
        req.total_item = 0;
        req.total_harga = 0;
        req.status = 'belum_lunas';

        try {
            const penjualan = await PenjualanObatRepository.createOtc(req, transaction);

            for (const item of req.items) {
                ZodValidator.validate(PenjualanObatValidation.CREATE_OTC_ITEM, item);
                item.penjualan_obat_uuid = penjualan.uuid;
                item.faskes_uuid = req.faskes_uuid;

                // get harga satuan for penjualan item
                item.harga_satuan = 0;

                await PenjualanObatRepository.createOtcItem(item, transaction);
            }

            // update price and stock

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            throw error;
        }
    }

    static async batalOtc(req) {
        ZodValidator.validate(PenjualanObatValidation.BATAL_OTC, req);
        req.status = 'cancel';
        return await PenjualanObatRepository.updateOtc(req);
    }

    static async getAll(req) {
        ZodValidator.validate(PenjualanObatValidation.GET_ALL, req);

        req.start_date = Utils.numberTo13Digit(req.start_date)
        req.end_date = Utils.numberTo13Digit(req.end_date)

        const data = await PenjualanObatRepository.getAllOtc(req);
        console.log(data);
        return data;
    }
}