import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";
import PrescriptionItemModel from "./prescription-item-model.js";

export default class ReturItemModel extends Model {
}

ReturItemModel.init({
        ...identifierModel,
        retur_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        prescription_item_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        expired_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        qty_retur: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        harga_satuan: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "retur_items",
        className: "ReturItem",
        underscored: true,
        hooks: hookModel,
        timestamps: false,
        indexes: [
            {
                fields: ['faskes_uuid'],
            },
        ],
    }
)

ReturItemModel.belongsTo(PrescriptionItemModel, {
    foreignKey: "prescription_item_uuid",
    as: "detail_prescription_item",
    constraints: false
})