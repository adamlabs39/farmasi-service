import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";

export default class OrderAlkesModel extends Model {
}

OrderAlkesModel.init({
        ...identifierModel,
        item_medis_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        no_order_alkes: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        no_reg: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        rekam_medis_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        patient_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        no_rm: {
            type: DataTypes.STRING(150),
            allowNull: false,
        },
        rekam_medis_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        order_status: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        petugas_order: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        harga_total: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        alasan_batal: {
            type: DataTypes.STRING(255),
        },
        dokter_order: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        petugas_verifikasi: {
            type: DataTypes.STRING(255),
        },
        petugas_penyiapan_obat: {
            type: DataTypes.STRING(255),
        },
        petugas_pemberi: {
            type: DataTypes.STRING(255),
        },
        petugas_pembatalan: {
            type: DataTypes.STRING(255),
        },
        penerima: {
            type: DataTypes.STRING(255),
        },
        waktu_verifikasi: {
            type: DataTypes.INTEGER,
        },
        waktu_penyiapan: {
            type: DataTypes.INTEGER,
        },
        waktu_pemberian: {
            type: DataTypes.INTEGER,
        },
        ...fieldTime
    }, {
        hooks: hookModel,
        sequelize: sequelizeInstance,
        tableName: "order_alkes",
        className: "OrderAlkes",
        underscored: true,
        timestamps: false,
        indexes: [
            {
                fields: ['faskes_uuid'],
            },
        ],
        uniqueKeys: {
            uniq_scores: {
                fields: ['no_order_alkes', 'faskes_uuid']
            }
        }
    }
)