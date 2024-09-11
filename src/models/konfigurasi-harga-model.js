import {DataTypes, Model} from "sequelize";
import identifierModel from "./common/identifier-model.js";
import fieldTime from "./base-model.js";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import {hookModel} from "./common/hook-model.js";

export default class KonfigurasiHargaModel extends Model {
}

KonfigurasiHargaModel.init({
        ...identifierModel,
        metode_pemotongan_stok: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        metode_hpp: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        ppn: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0
        },
        margin: {
            type: DataTypes.FLOAT,
            allowNull: false,
            defaultValue: 0,
        },
        biaya_embalase_racik: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            defaultValue: false,
        },
        metode_biaya_racikan: {
            type: DataTypes.ENUM('paket', 'item'),
        },
        petugas: {
            type: DataTypes.STRING(255),
        },
        ...fieldTime
    }, {
        sequelize: sequelizeInstance,
        tableName: "konfigurasi_harga",
        className: "KonfigurasiHarga",
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