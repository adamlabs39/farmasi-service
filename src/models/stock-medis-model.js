import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";

export default class StockMedisModel extends Model {
}

StockMedisModel.init({
        ...identifierModel,
        item_medis_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        exp_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        stok: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        sisa_stok: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        konversi_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        lokasi_stok_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        harga_satuan: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        jenis_stok_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "stock_medis",
        className: "StockMedis",
        hooks: hookModel,
        underscored: true,
        timestamps: false,
        indexes: [
            {
                fields: ['faskes_uuid'],
            },
        ],
    }
)