import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";

export default class JenisStokItemMedisModel extends Model {
}

JenisStokItemMedisModel.init({
        ...identifierModel,
        jenis_stok_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        item_medis_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "jenis_stok_item_medis",
        className: "JenisStokItemMedis",
        underscored: true,
        hooks: hookModel,
        timestamps: false,
        indexes: [
            {
                fields: ['faskes_uuid'],
            },
        ],
        uniqueKeys: {
            uniq_scores: {
                fields: ['jenis_stok_uuid', 'item_medis_uuid']
            }
        }
    }
)