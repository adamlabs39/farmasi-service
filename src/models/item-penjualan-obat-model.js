import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";

export default class ItemPenjualanObatModel extends Model {
}

ItemPenjualanObatModel.init({
        ...identifierModel,
        penjualan_obat_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        item_medis_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        qty: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        jenis_stok_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        satuan_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        harga_satuan: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        diskon: {
            type: DataTypes.FLOAT,
        },
        catatan_stok: {
            type: DataTypes.JSON
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "item_penjualan_obat",
        className: "ItemPenjualanObat",
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