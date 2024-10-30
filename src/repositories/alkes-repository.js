import PrescriptionModel from "../models/prescription-model.js";
import PrescriptionItemModel from "../models/prescription-item-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import ItemMedisModel from "../models/item-medis-model.js";
import SatuanModel from "../models/satuan-model.js";
import {Op} from "sequelize";
import LokasiStokModel from "../models/lokasi-stok-model.js";
import Utils from "../helpers/utils.js";
import OrderAlkesModel from "../models/order-alkes-model.js";
import OrderAlkesItemModel from "../models/order-alkes-item-model.js";
import InternalServerException from "../errors/internal-server-exception.js";
import {LokasiModel} from "@adameds/model-sdk/datamaster";
import PatientModel from "../models/patient-model.js";

export default class AlkesRepository {
    // get prescription by uuid
    static async getByUuid(uuid) {
        return await OrderAlkesModel.findOne(
            {
                where: {
                    uuid: uuid
                },
                attributes : {
                  exclude: ['deleted_at', 'created_at', 'updated_at', 'faskes_uuid']
                },
                include : [
                    {
                        model : OrderAlkesItemModel,
                        as : 'alkes_items',
                        required : false,
                        attributes : {
                            exclude: ['deleted_at', 'created_at', 'updated_at', 'faskes_uuid', 'item_medis_uuid']
                        },
                        include : [
                            {
                                model : ItemMedisModel,
                                as : 'item_medis',
                                required: false,
                                attributes : ['name', 'uuid'],
                                include : [
                                    {
                                        model : SatuanModel,
                                        as : 'satuan_penggunaan',
                                        required: false,
                                        attributes : ['name']
                                    }
                                ]
                            },
                        ]
                    }
                ]
            }
        );
    }

    // create prescription
    static async createAlkes(req, transaction) {
        return await OrderAlkesModel.create(req, {transaction});
    }

    // create prescription item
    static async createAlkesItem(req, transaction) {
        return await OrderAlkesItemModel.create(req, {transaction});
    }

    // get all prescription
    static async getAllAlkes(req) {
        req.search = Utils.nullToType(req.search)
        req.lokasi_stok_uuid = Utils.nullToType(req.lokasi_stok_uuid)
        req.jenis_pelayanan = Utils.nullToType(req.jenis_pelayanan)
        req.racikan = Utils.nullToType(req.racikan)
        req.takeaway = Utils.nullToType(req.takeaway)
        req.is_chronic = Utils.nullToType(req.is_chronic)

        req.start_date = Utils.numberTo13Digit(req.start_date)
        req.end_date = Utils.numberTo13Digit(req.end_date)

        let wherePrescription =  {
            faskes_uuid: req.faskes_uuid,
                [Op.or]: [
                { no_resep: { [Op.iLike]: `%${req.search}%` } },
                { no_rm: { [Op.iLike]: `%${req.search}%` } }
            ],
                lokasi_stok_uuid : { [Op.like]: `%${req.lokasi_stok_uuid}%` },
            order_date : {
                [Op.between]: [req.start_date, req.end_date]
            },
            order_status : {
                [Op.between]: [1, 4]
            }
        }

        if (req.jenis_pelayanan !== ""){
            wherePrescription.jenis_pelayanan = req.jenis_pelayanan
        }

        if(req.takeaway !== ""){
            wherePrescription.is_takeaway = true
        }

        let wherePrescriptionItem = {}

        if (req.racikan !== ""){
            wherePrescriptionItem.is_compound = true
        }

        if (req.is_chronic !== "") {
            wherePrescriptionItem.is_chronic = true
        }

        return await PrescriptionModel.findAll(
            {
                where : wherePrescription,
                attributes : ['uuid','no_rm', 'no_reg' ,'no_resep', 'dokter_order', 'jenis_pelayanan', 'order_date', 'is_takeaway', 'order_status'],
                include : [
                    {
                        model: PrescriptionItemModel,
                        as: 'obat',
                        required : (req.is_chronic === true) || (req.racikan === true),
                        attributes : ["is_chronic", "is_compound"],
                        where : wherePrescriptionItem,
                    }
                ]
            },
        );
    }

    // get all prescription item
    static async getAllAlkesItem(alkes_uuid) {
        return await PrescriptionItemModel.findAll(
            {
                where: {
                    prescription_uuid: alkes_uuid
                }
            }
        );
    }

    // delete alkes item
    static async deleteAlkesItem(alkes_item_uuid) {
        return await sequelizeInstance.transaction(async (tr) => {
            return await OrderAlkesItemModel.destroy(
                {
                    where: {
                        uuid: alkes_item_uuid
                    },
                    transaction: tr
                });
        });
    }

    // edit alkes
    static async editAlkes(req, transaction) {
        const affectedRow = await OrderAlkesModel.update(
            req,
            {
                where: {
                    uuid: req.uuid
                },
                transaction: transaction
            }
        );

        if(affectedRow[0] === 0){
            throw new InternalServerException("Tidak ada data yang diubah");
        }

        return affectedRow;
    }

    // edit alkes item
    static async editAlkesItem(req) {
        const affectedRow = await OrderAlkesItemModel.update(
            req,
            {
                where: {
                    uuid: req.uuid
                }
            }
        );

        if(affectedRow[0] === 0){
            throw new InternalServerException("Tidak ada data yang diubah");
        }

        return affectedRow;
    }

    static async getOrderBySomeUuid(req){
        return await OrderAlkesModel.findAll({
            where: {
                rekam_medis_uuid : req.rekam_medis_uuid,
                rekam_medis_date : req.rekam_medis_date
            },
            attributes : ['uuid', "order_status", 'no_order_alkes', 'petugas_order', 'created_at'],
            include: [
                {
                    model: OrderAlkesItemModel,
                    as: 'alkes_items',
                    required: false,
                },
                {
                    model : LokasiStokModel,
                    as : 'lokasi_stok',
                    required: false,
                    attributes : ["name"]
                }
            ],
        });
    }

    static getAllForFarmacy(req){
        req.search = Utils.nullToType(req.search)
        req.lokasi_stok_uuid = Utils.nullToType(req.lokasi_stok_uuid)

        req.start_date = Utils.numberTo13Digit(req.start_date)
        req.end_date = Utils.numberTo13Digit(req.end_date)

        return OrderAlkesModel.findAll({
            where: {
                order_status : {
                    [Op.in]: [1, 2, 3]
                },
                faskes_uuid : req.faskes_uuid,
                [Op.or]: [
                    { no_order_alkes: { [Op.iLike]: `%${req.search}%` } },
                    { no_rm: { [Op.iLike]: `%${req.search}%` } },
                    sequelizeInstance.where(
                        sequelizeInstance.col('patient.name'),
                        {[Op.iLike]: `%${req.search || ''}%`}
                    )
                ],
                created_at : {
                    [Op.between]: [req.start_date, req.end_date]
                },
                lokasi_stok_uuid : { [Op.like]: `%${req.lokasi_stok_uuid}%` },
            },
            attributes : [
                'uuid',
                'no_order_alkes',
                'order_status',
                'petugas_order',
                'created_at',
                "no_reg",
                "no_rm",
            ],
            include: [
                {
                    model : LokasiModel,
                    as : 'lokasi',
                    required : false,
                    attributes : ['name']
                },
                {
                    model : PatientModel,
                    as : 'patient',
                    required : false,
                    attributes : ['name']
                }
            ],
        });
    }
}