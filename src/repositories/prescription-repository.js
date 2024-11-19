import sequelizeInstance from "../configurations/sequelize-instance.js";
import moment from "moment";
import NotfoundException from "../errors/notfound-exception.js";
import BadRequestException from "../errors/bad-request-exception.js";
import {Op} from "sequelize";
import Utils from "../helpers/utils.js";
import {toEpochDate} from "../helpers/date-helper.js";
import {
    AturanPakaiModel,
    BentukRacikanModel, CaraiPakaiModel, FpoPemberianModel,
    ItemMedisModel, JenisStokModel, LokasiStokModel,
    PrescriptionItemModel,
    PrescriptionItemRacikanModel,
    PrescriptionModel, SatuanModel
} from "@adameds/model-sdk/farmasi";
import {PatientModel} from "@adameds/model-sdk/admisi";
import Pagination from "../helpers/pagination.js";

export default class PrescriptionRepository {
    // get prescription by uuid
    static async getByUuid(uuid) {
        return await PrescriptionModel.findOne(
            {
                where: {
                    uuid: uuid
                },
                attributes: {
                    exclude: ['deleted_at', 'created_at', 'faskes_uuid']
                },
                include: [
                    {
                        model: PrescriptionItemModel,
                        as: 'obat',
                        required: false,
                        attributes: {
                            exclude: ['deleted_at', 'created_at', 'updated_at', 'faskes_uuid']
                        },
                        include: [
                            {
                                model: PrescriptionItemRacikanModel,
                                as: 'racikan',
                                required: false,
                                attributes: {
                                    exclude: ['deleted_at', 'created_at', 'updated_at', 'faskes_uuid']
                                },
                                include: [
                                    {
                                        model: ItemMedisModel,
                                        as: 'item_medis',
                                        required: false,
                                        attributes: ['name', 'uuid'],
                                        include: [
                                            {
                                                model: SatuanModel,
                                                as: 'satuan_penggunaan',
                                                required: false,
                                                attributes: ['name']
                                            }
                                        ]
                                    },
                                ]
                            },
                            {
                                model: ItemMedisModel,
                                as: 'item_medis',
                                required: false,
                                attributes: ['name', 'uuid'],
                                include: [
                                    {
                                        model: SatuanModel,
                                        as: 'satuan_penggunaan',
                                        required: false,
                                        attributes: ['name']
                                    }
                                ]
                            },
                            {
                                model: AturanPakaiModel,
                                as: 'aturan_pakai',
                                required: false,
                                attributes: ['name']
                            },
                            {
                                model: CaraiPakaiModel,
                                as: 'cara_pakai',
                                required: false,
                                attributes: ['cara_pakai']
                            },
                            {
                                model: BentukRacikanModel,
                                as: 'bentuk_racikan',
                                required: false,
                                attributes: ['nama_bentuk_racikan']
                            },
                            {
                                model : JenisStokModel,
                                as : 'jenis_stok',
                                required: false,
                                attributes: ["name"]
                            }
                        ],
                    },
                ],
            }
        );
    }

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
    static async getAllPrescription(req) {
        req.search = Utils.nullToType(req.search)
        req.lokasi_stok_uuid = Utils.nullToType(req.lokasi_stok_uuid)
        req.jenis_pelayanan = Utils.nullToType(req.jenis_pelayanan)
        req.racikan = Utils.nullToType(req.racikan)
        req.takeaway = Utils.nullToType(req.takeaway)
        req.is_chronic = Utils.nullToType(req.is_chronic)
        req.status = Utils.nullToType(req.status, Array)

        req.start_date = Utils.numberTo13Digit(req.start_date)
        req.end_date = Utils.numberTo13Digit(req.end_date)

        let wherePrescription = {
            faskes_uuid: req.faskes_uuid,
            [Op.or]: [
                {no_resep: {[Op.iLike]: `%${req.search}%`}},
                {no_rm: {[Op.iLike]: `%${req.search}%`}},
                sequelizeInstance.where(
                    sequelizeInstance.col('patient.name'),
                    {[Op.iLike]: `%${req.search || ''}%`}
                )
            ],
            lokasi_stok_uuid: {[Op.like]: `%${req.lokasi_stok_uuid}%`},
            order_date: {
                [Op.between]: [req.start_date, req.end_date]
            },
            order_status: {
                [Op.between]: [1, 4]
            }
        }

        if (req.status.length > 0) {
            wherePrescription.order_status = {
                [Op.between]: req.status
            }
        }

        if (req.jenis_pelayanan !== "") {
            wherePrescription.jenis_pelayanan = req.jenis_pelayanan
        }

        if (req.takeaway !== "") {
            wherePrescription.is_takeaway = true
        }

        let wherePrescriptionItem = {}

        if (req.racikan !== "") {
            wherePrescriptionItem.is_compound = true
        }

        if (req.is_chronic !== "") {
            wherePrescriptionItem.is_chronic = true
        }

        const options = {
            attributes: ['uuid', 'no_rm', 'no_reg', 'no_resep', 'dokter_order', 'jenis_pelayanan', 'order_date', 'is_takeaway', 'order_status'],
            include: [
                {
                    model: PrescriptionItemModel,
                    as: 'obat',
                    required: (req.is_chronic === true) || (req.racikan === true),
                    attributes: ["is_chronic", "is_compound"],
                    where: wherePrescriptionItem,
                },
                {
                    model: PatientModel,
                    as: 'patient',
                    required: false,
                    attributes: ['name']
                },
                {
                    model : LokasiStokModel,
                    as : 'lokasi_stok',
                    required: false,
                    attributes: ["name"]
                }
            ],
            where: wherePrescription,
        }

        if(!req.pagination){
            return await PrescriptionModel.findAll(
                {options},
            );
        } else {
            return await Pagination.init(PrescriptionModel, req, options);
        }
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
        return await sequelizeInstance.transaction(async (tr) => {
            const affectedRow = await PrescriptionItemModel.destroy(
                {
                    where: {
                        uuid: prescription_item_uuid
                    },
                    transaction: tr
                });

            await PrescriptionItemRacikanModel.destroy(
                {
                    where: {
                        prescription_item_uuid: prescription_item_uuid
                    },
                    transaction: tr
                },
            );

            return affectedRow;
        });
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
    static async editPrescription(req, transaction) {
        return await PrescriptionModel.update(
            req,
            {
                where: {
                    uuid: req.uuid
                },
                transaction: transaction
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
    static async editPrescriptionItem(req, transaction) {
        if (transaction === null || transaction === undefined) {
            transaction = await sequelizeInstance.transaction()
        }

        return await PrescriptionItemModel.update(
            req,
            {
                where: {
                    uuid: req.uuid
                },
                transaction
            },
        );
    }

    static async getHistoryObat(req) {
        if (req.group_index === null || req.group_index === undefined) {
            req.group_index = 0;
        }

        let filter = {
            no_rm: req.no_rm,
            faskes_uuid: req.faskes_uuid,
            order_status: 5
        };

        if (req.pelayanan !== null && req.pelayanan !== undefined && req.pelayanan !== "") {
            filter.jenis_pelayanan = req.pelayanan;
        }

        const prescriptions = await PrescriptionModel.findAll({
            where: filter,
            order: [['created_at', 'DESC']],
            attributes: ['no_resep', 'dokter_order', 'jenis_pelayanan', 'order_date'],
            include: [
                {
                    model: PrescriptionItemModel,
                    as: 'obat',
                    attributes: ['medication_qty'],
                    required: false,
                    include: [
                        {
                            model: AturanPakaiModel,
                            as: 'aturan_pakai',
                            required: false,
                            attributes: ['name']
                        },
                        {
                            model: ItemMedisModel,
                            as: 'item_medis',
                            required: false,
                            attributes: ['name']
                        },
                        {
                            model: SatuanModel,
                            as: 'satuan_dosis',
                            required: false,
                            attributes: ['name']
                        }
                    ]
                },
            ],
        });

        if (!prescriptions.length) {
            throw new NotfoundException('Tidak ada data prescription ditemukan.');
        }

        const groupedPrescriptions = prescriptions.reduce((groups, prescription) => {
            const dayKey = moment.unix(prescription.created_at).startOf('day').format('X'); // Format sebagai epoch (X)
            if (!groups[dayKey]) {
                groups[dayKey] = [];
            }
            groups[dayKey].push(prescription);
            return groups;
        }, {});

        const sortedGroupKeys = Object.keys(groupedPrescriptions).sort((a, b) => b - a); // Urutkan berdasarkan hari terbaru
        const totalGroups = sortedGroupKeys.length;

        if (req.group_index >= totalGroups || req.group_index < 0) {
            throw new BadRequestException('Index kelompok melebihi batas.');
        }

        const currentGroupKey = sortedGroupKeys[req.group_index];
        const currentGroup = groupedPrescriptions[currentGroupKey];


        return {
            data: currentGroup,
            metadata: {
                total_pages: totalGroups,
                page: parseInt(req.group_index) + 1
            }
        };
    }

    static async getOrderBySomeUuid(uuidArray) {
        return await PrescriptionModel.findAll({
            where: {
                uuid: {
                    [Op.in]: uuidArray,
                },
            },
            attributes: ['uuid', 'no_resep', 'dokter_order', 'jenis_pelayanan', 'order_date', "is_takeaway", "order_status"],
            include: [
                {
                    model: PrescriptionItemModel,
                    as: 'obat',
                    required: false,
                },
                {
                    model: LokasiStokModel,
                    as: 'lokasi_stok',
                    required: false,
                    attributes: ["name"]
                }
            ],
        });
    }

    static async getPrescriptionUuidByObat(item_uuid) {
        return await PrescriptionItemModel.findOne({
            where: {
                uuid: item_uuid
            },
            attributes: ['prescription_uuid']
        })
    }

    static async getForFpo(req) {
        const selectedDate = new Date(req.date);

        let itemWhereOptions = {};
        if (moment(selectedDate).isSame(new Date(), 'day')) {
            itemWhereOptions = {
                sisa_qty_order: {
                    [Op.gt]: 0
                }
            }
        }

        let prescriptionOptions = {
            where: {
                created_at: {
                    [Op.lte]: toEpochDate(selectedDate)
                },
                order_status: 5,
                rekam_medis_uuid: req.rekam_medis_uuid,
            },
            attributes: ["no_resep", "dokter_order"],
            include: [
                {
                    model: PrescriptionItemModel,
                    required: true,
                    as: "obat",
                    where: itemWhereOptions,
                    attributes: ["uuid", "medication_dose_qty", "medication_qty", "nama_racikan", "sisa_qty_order"],
                    include: [
                        {
                            model: ItemMedisModel,
                            as: 'item_medis',
                            required: false,
                            attributes: ['name', 'uuid'],
                            include: [
                                {
                                    model: SatuanModel,
                                    as: 'satuan_penggunaan',
                                    required: false,
                                    attributes: ['name']
                                }
                            ]
                        },
                        {
                            model: AturanPakaiModel,
                            as: 'aturan_pakai',
                            required: false,
                            attributes: ['name']
                        },
                        {
                            model: CaraiPakaiModel,
                            as: 'cara_pakai',
                            required: false,
                            attributes: ['cara_pakai']
                        },
                        {
                            model: SatuanModel,
                            as: 'satuan_dosis',
                            required: false,
                            attributes: ['name']
                        },
                        {
                            model: BentukRacikanModel,
                            as: 'bentuk_racikan',
                            required: false,
                            attributes: ['nama_bentuk_racikan']
                        },
                        {
                            model: FpoPemberianModel,
                            as: "fpo_pemberian",
                            required: !(moment(selectedDate).isSame(new Date(), 'day')),
                            attributes: ["jam_pemberian"],
                            where: {
                                jam_pemberian: {
                                    [Op.between]: [
                                        moment(selectedDate).startOf('day').valueOf(),
                                        moment(selectedDate).endOf('day').valueOf()
                                    ]
                                }
                            }
                        }
                    ]
                }
            ]
        }

        return await PrescriptionModel.findAll(prescriptionOptions);
    }

    static async getPrescriptionByUuid(uuid) {
        const data = await PrescriptionItemModel.findOne({
            where: {
                uuid: uuid
            },
        });

        if(!data){
            throw new NotfoundException('Data tidak ditemukan');
        }

        return data;
    }
}