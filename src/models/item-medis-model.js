import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";

export default class ItemMedisModel extends Model {
}

ItemMedisModel.init({
        ...identifierModel,
        code: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        bentuk_sediaan_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        dosis: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        satuan_dosis_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        isi_kemasan: {
            type: DataTypes.FLOAT,
        },
        satuan_kemasan_uuid: {
            type: DataTypes.STRING(255),
        },
        satuan_penggunaan_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        satuan_pembelian_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        manufacture_uuid: {
            type: DataTypes.STRING(255),
        },
        stock_min: {
            type: DataTypes.INTEGER,
        },
        stock_max: {
            type: DataTypes.INTEGER,
        },
        harga_dasar: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        hna: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        hja: {
            type: DataTypes.FLOAT,
            allowNull: false,
        },
        jenis_item: {
            type: DataTypes.ENUM('obat', 'alkes'),
            allowNull: false,
        },
        kategori_obat_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ingredient_uuid: {
            type: DataTypes.STRING(255),
        },
        exp_date: {
            type: DataTypes.DATE,
            allowNull: false,
        },
        supplier_uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "item_medis",
        className: "ItemMedis",
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