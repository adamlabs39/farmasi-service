import {DataTypes, Model} from "sequelize";
import fieldTime from "./base-model.js";
import {uuidv7} from "uuidv7";
import sequelizeInstance from "../configurations/sequelize-instance.js";

export default class UserModel extends Model {
}
UserModel.init(
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            unique: true,
            primaryKey: true,
            autoIncrement: true,
        },
        uuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
            defaultValue: uuidv7()
        },
        faskesUuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        roleUuid: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: false,
        },
        name: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: false,
        },
        phone: {
            type: DataTypes.STRING(15),
            allowNull: false,
            unique: false,
        },
        email: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: true,
        },
        username: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: false,
        },
        password: {
            type: DataTypes.STRING(255),
            allowNull: false,
            unique: false,
        },
        token: {
            type: DataTypes.STRING(1000),
            allowNull: true,
        },
        inventoryMedis: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: false,
        },
        inventoryNonMedis: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
            unique: false,
        },
        photo: {
            type: DataTypes.TEXT,
            allowNull: true,
        },
        awalan_gelar : {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        akhiran_gelar : {
            type: DataTypes.STRING(50),
            allowNull: true,
        },
        status: {
            type: DataTypes.BOOLEAN,
            allowNull: false,
        },
        ...fieldTime
    },
    {
        sequelize: sequelizeInstance,
        tableName: "users",
        underscored: true,
        timestamps: false
    }
);
