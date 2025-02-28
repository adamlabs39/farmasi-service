import sequelizeInstance from "../configurations/sequelize-instance.js";
import ZodValidator from "../validations/zod-validator.js";
import ReturValidation from "../validations/retur-validation.js";
import ReturRepository from "../repositories/retur-repository.js";
import PrescriptionRepository from "../repositories/prescription-repository.js";
import BadRequestException from "../errors/bad-request-exception.js";
import OrderAlkesRepository from "../repositories/alkes-repository.js";
import {uuidv7} from "uuidv7";
import PrescriptionValidation from "../validations/prescription-validation.js";
import AlkesRepository from "../repositories/alkes-repository.js";
import StockMedisRepository from "../repositories/stock-medis-repository.js";
import moment from "moment";
import Utils from "../helpers/utils.js";
import {setRangeDate} from "../helpers/date-helper.js";
import axiosInstance from "../configurations/axios-instance.js";
import {INVENTORY_URL} from "../helpers/constants.js";
import InternalServerException from "../errors/internal-server-exception.js";

export default class ReturService {
    static async create(req) {
        ZodValidator.validate(ReturValidation.CREATE, req);

        const retur_uuid = uuidv7();

        if (req.jenis_retur === "obat") {
            const prescription = await PrescriptionRepository.getByUuid(req.prescription_uuid);
            if (!prescription) {
                throw new BadRequestException("Prescription not found");
            }

            if (prescription.order_status !== 5) {
                throw new BadRequestException("Order can't returned because its status");
            }

            req.no_resep = prescription.no_resep;
            req.no_reg = prescription.no_reg;
            req.rekam_medis_uuid = prescription.rekam_medis_uuid;
            req.patient_uuid = prescription.patient_uuid;
            req.no_rm = prescription.no_rm;
            req.order_date = prescription.order_date;
            req.lokasi_stok_uuid = prescription.lokasi_stok_uuid;
        } else if (req.jenis_retur === "alkes") {
            const alkes = await OrderAlkesRepository.getByUuid(req.order_alkes_uuid);
            if (!alkes) {
                throw new BadRequestException("Order Alkes not found");
            }

            if (alkes.order_status !== 4) {
                throw new BadRequestException("Order can't returned its status");
            }

            req.no_order_alkes = alkes.no_order_alkes;
            req.no_reg = alkes.no_reg;
            req.rekam_medis_uuid = alkes.rekam_medis_uuid;
            req.patient_uuid = alkes.patient_uuid;
            req.no_rm = alkes.no_rm;
            req.order_date = alkes.waktu_verifikasi;
            req.lokasi_stok_uuid = alkes.lokasi_stok_uuid;
        }

        const mutasiItems = [];

        const transaction = await sequelizeInstance.transaction();

        try {
            let total = 0;

            for (const item of req.items) {
                item.faskes_uuid = req.faskes_uuid;
                item.retur_uuid = retur_uuid;

                if (item.qty_retur <= 0) {
                    continue;
                }

                total += (item.harga_satuan * item.qty_retur);

                ZodValidator.validate(ReturValidation.CREATE_ITEM, item);

                await ReturRepository.createItem(item, transaction);

                // bring back stock
                if (req.jenis_retur === "obat") {
                    const prescriptionItem = await PrescriptionRepository.getPrescriptionByUuid(item.prescription_item_uuid);

                    if (!prescriptionItem.stok_medis_uuides) {
                        throw new BadRequestException("Stock medis uuides not found");
                    }

                    for (const stock of prescriptionItem.stok_medis_uuides) {
                        const stockRetured = await StockMedisRepository.addQuantity({
                            stock_medis_uuid: stock.stock_medis_uuid,
                            quantity: stock.quantity,
                        }, transaction)

                        mutasiItems.push({
                            item_uuid: prescriptionItem.item_medis_uuid,
                            exp_date: stock.exp_date,
                            stok_awal: stockRetured.dataValues.sisa_stok,
                            stok_mutasi: stockRetured.dataValues.sisa_stok + stock.quantity,
                            jenis_stok_uuid: prescriptionItem.jenis_stok_uuid,
                            lokasi_stok_uuid: stockRetured.dataValues.lokasi_stok_uuid,
                            type: "surplus"
                        });
                    }
                } else if (req.jenis_retur === "alkes") {
                    const alkesItem = await OrderAlkesRepository.getAlkesItem(item.order_alkes_item_uuid);


                    if (!alkesItem.stok_medis_uuides) {
                        throw new BadRequestException("Stock medis uuides not found");
                    }

                    for (const stock of alkesItem.stok_medis_uuides) {
                        const stockRetured = await StockMedisRepository.addQuantity({
                            stock_medis_uuid: stock.stock_medis_uuid,
                            quantity: stock.quantity,
                        }, transaction)

                        mutasiItems.push({
                            item_uuid: alkesItem.item_medis_uuid,
                            exp_date: stock.exp_date,
                            stok_awal: stockRetured.dataValues.sisa_stok,
                            stok_mutasi: stockRetured.dataValues.sisa_stok + stock.quantity,
                            jenis_stok_uuid: alkesItem.jenis_stok_uuid,
                            lokasi_stok_uuid: stockRetured.dataValues.lokasi_stok_uuid,
                            type: "surplus"
                        });
                    }
                }
            }

            req.waktu_retur = moment().unix();
            // update status
            if (req.jenis_retur === "obat") {
                await PrescriptionRepository.editPrescription({
                    uuid: req.prescription_uuid,
                    order_status: 6,
                    petugas_retur: req.petugas_retur,
                    waktu_retur: req.waktu_retur
                }, transaction)
            } else if (req.jenis_retur === "alkes") {
                await OrderAlkesRepository.editAlkes({
                    uuid: req.order_alkes_uuid,
                    order_status: 5,
                    petugas_retur: req.petugas_retur,
                    waktu_retur: req.waktu_retur
                }, transaction)
            }


            req.uuid = retur_uuid;
            req.total = total;
            const retur = await ReturRepository.create(req, transaction);

            // region UPLOAD TO INVENTORY
            try {
                await axiosInstance.post(`${INVENTORY_URL}/mutasi`, {
                    sumber_mutasi: "farmasi",
                    with_check_stock: true,
                    code: req.no_order_alkes ? req.no_order_alkes : req.no_resep,
                    keterangan: {
                        description: `Retur ${req.jenis_retur === "obat" ? "Obat" : "Farmasi Ruangan"}`,
                    },
                    items: mutasiItems,
                }, {
                    headers: {
                        Authorization: req.token
                    }
                });
            } catch (error) {
                if (error.response) {
                    throw new InternalServerException("[SERVER INVENTORY]: " + error.response.data.message);
                } else if (error.request) {
                    throw new InternalServerException("Tidak ada respons dari server inventory");
                } else {
                    throw new InternalServerException("Kesalahan saat menyiapkan permintaan inventory");
                }
            }
            // endregion

            await transaction.commit();
            return retur;
        } catch (e) {
            await transaction.rollback();
            throw e;
        }

    }

    static async getDetail(req) {
        ZodValidator.validate(ReturValidation.GET_DETAIL, req);

        let result;
        if (req.item_type === "obat") {
            result = await ReturRepository.getObatDetail(req);
        } else if (req.item_type === "alkes") {
            result = await ReturRepository.getAlkesDetail(req);
        }

        result = this.mapReturDetail(result, req.item_type);
        if (!result) {
            throw new BadRequestException("Data not found");
        }

        return result;
    }

    static
    async getAll(req) {
        ZodValidator.validate(ReturValidation.GET_ALL, req);

        setRangeDate(req);

        if (!req.payment_method){
            req.payment_method = 0;
        }
        req.payment_method = parseInt(req?.payment_method ?? "0");

        let result;
        req.pagination = true;
        req.subQuery = false;

        if (req.item_type === "obat") {
            req.status = [5, 5]
            ZodValidator.validate(PrescriptionValidation.GET_ALL, req);
            result = await PrescriptionRepository.getAllPrescription(req);
        } else if (req.item_type === "alkes") {
            req.status = [4, 4]
            ZodValidator.validate(PrescriptionValidation.GET_ALL, req);
            result = await AlkesRepository.getAllForFarmacy(req);
        }

        if (!result) {
            throw new BadRequestException("Data not found");
        }

        return result;
    }

    static mapReturDetail(req, type) {
        const data = [];

        req.forEach((item) => {
            const detail = {
                "name": item.dataValues?.item_medis?.name,
                "available_qty": `${item.dataValues?.sisa_qty_order ?? item.dataValues.qty} ${item.dataValues?.item_medis?.satuan_penggunaan?.name}`,
                "detail" : [{
                    "uuid" : item.dataValues?.uuid,
                    "jenis_stok": item.dataValues?.jenis_stok?.name,
                    "used_qty" : type === 'obat' ? (item.dataValues?.medication_qty - item.dataValues?.sisa_qty_order) : undefined,
                    "price" : item.dataValues?.harga_satuan,
                    "total" : 0,
                    "exp_date" : item.dataValues?.stok_medis_uuides[0]?.expired_date,
                    "qty_retur" : 0,
                }]
            }
            data.push(detail);
        })

        return data;
    }
}