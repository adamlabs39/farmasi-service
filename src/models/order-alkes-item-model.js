import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";

export default class OrderAlkesItemModel extends Model {
}

OrderAlkesItemModel.init({
        ...identifierModel,
        order_alkes_uuid: {
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
        satuan_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        harga_satuan: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        ...fieldTime
    }, {
        hooks: hookModel,
        sequelize: sequelizeInstance,
        tableName: "order_alkes_items",
        className: "OrderAlkesItem",
        underscored: true,
        timestamps: false,
        indexes: [
            {
                fields: ['faskes_uuid'],
            },
        ],
    }
)