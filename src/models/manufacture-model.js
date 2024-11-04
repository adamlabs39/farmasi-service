import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";
import {KabupatenModel, KecamatanModel, KelurahanModel, ProvinceModel} from "@adameds/model-sdk/datamaster";

export default class ManufactureModel extends Model {
}

ManufactureModel.init({
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
        alamat: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        kode_pos: {
            type: DataTypes.STRING(10),
            allowNull: false,
        },
        kecamatan_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        provinsi_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        kabupaten_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        kelurahan_code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "manufactures",
        className: "Manufacture",
        hooks: hookModel,
        underscored: true,
        timestamps: false,
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

ManufactureModel.belongsTo(ProvinceModel, {
    foreignKey: 'provinsi_code',
    targetKey: 'code',
    as: 'province',
    constraints: false
})

ManufactureModel.belongsTo(KabupatenModel, {
    foreignKey: 'kabupaten_code',
    targetKey: 'code',
    as: 'kabupaten',
    constraints: false
})

ManufactureModel.belongsTo(KecamatanModel, {
    foreignKey: 'kecamatan_code',
    targetKey: 'code',
    as: 'kecamatan',
    constraints: false
})

ManufactureModel.belongsTo(KelurahanModel, {
    foreignKey: 'kelurahan_code',
    targetKey: 'code',
    as: 'kelurahan',
    constraints: false
})