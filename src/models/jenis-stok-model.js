import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";
import StockMedisModel from "./stock-medis-model.js";

export default class JenisStokModel extends Model {
}

JenisStokModel.init({
        ...identifierModel,
        code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "jenis_stok",
        className: "JenisStok",
        underscored: true,
        timestamps: false,
        hooks: hookModel,
        indexes: [
            {
                fields: ['faskes_uuid'],
            },
        ],
        uniqueKeys: {
            uniq_scores: {
                fields: ['code', 'faskes_uuid']
            }
        }
    }
)

JenisStokModel.hasMany(StockMedisModel, {
    foreignKey: "jenis_stok_uuid",
    as: "stocks"
})