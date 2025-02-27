import {Op} from "sequelize";
import sequelizeInstance from "../configurations/sequelize-instance.js";
import BadRequestException from "../errors/bad-request-exception.js";
import {StockMedisModel} from "@adameds/model-sdk/inventory";
import {ItemMedisJenisStokModel} from "@adameds/model-sdk/farmasi";

export default class StockMedisRepository {
    static async reduceQuantity(req, t) {
        let remainingQuantity = req.quantity;
        let stock;
        const today = new Date();

        let order = [];

        let result = [];

        if (req.metode_pemotongan_stok === "FEFO") {
            order.push(["exp_date", "ASC"]);
        } else if (req.metode_pemotongan_stok === "FIFO") {
            order.push(["created_at", "ASC"]);
        } else {
            order.push(["created_at", "DESC"]);
        }

        const sisaStockRaw = await StockMedisModel.findAll( {
            where: {
                sisa_stok: {
                    [Op.gt]: 0
                },
                exp_date: {
                    [Op.gt]: today
                },
                lokasi_stok_uuid : req.lokasi_stok_uuid,
            },
            attributes : ['sisa_stok'],
            include: [
                {
                    model : ItemMedisJenisStokModel,
                    as : 'item_medis_jenis_stok',
                    required: true,
                    where: {
                        jenis_stok_uuid : req.jenis_stok_uuid,
                        item_medis_uuid: req.item_medis_uuid,
                    },
                    attributes : ['uuid'],
                }
            ],
            transaction: t,
        });

        const totalStock = sisaStockRaw.reduce((acc, curr) => acc + curr.sisa_stok, 0);


        if (totalStock < req.quantity) {
            throw new BadRequestException(`${req.name} not enough or empty (total stock : ${totalStock})`);
        }

        while (remainingQuantity > 0) {
            stock = await StockMedisModel.findOne({
                where: {
                    sisa_stok: {
                        [Op.gt]: 0
                    },
                    exp_date: {
                        [Op.gt]: today
                    },
                    lokasi_stok_uuid : req.lokasi_stok_uuid,
                },
                include: [
                    {
                        model : ItemMedisJenisStokModel,
                        as : 'item_medis_jenis_stok',
                        required: true,
                        where: {
                            item_medis_uuid: req.item_medis_uuid,
                            jenis_stok_uuid : req.jenis_stok_uuid,
                        },
                        attributes : ['uuid'],
                    }
                ],
                order: order,
                transaction: t,
                lock: t.LOCK.UPDATE,
            });

            const newStock = stock.sisa_stok - remainingQuantity;

            if (newStock >= 0) {
                await StockMedisModel.update(
                    {sisa_stok: newStock},
                    {
                        where: {uuid: stock.uuid},
                        transaction: t
                    }
                );

                result.push({
                    stock_medis_uuid: stock.uuid,
                    quantity: remainingQuantity,
                    expired_date : stock.exp_date,
                    stock_before : stock.sisa_stok,
                });

                remainingQuantity = 0;
            } else {
                await StockMedisModel.update(
                    {sisa_stok: 0},
                    {
                        where: {
                            uuid: stock.uuid,
                        },
                        transaction: t
                    }
                );
                result.push({
                    stock_medis_uuid: stock.uuid,
                    quantity:  stock.sisa_stok,
                    expired_date : stock.exp_date,
                    stock_before : stock.sisa_stok,
                });

                remainingQuantity = Math.abs(newStock);
            }
        }

        return result;
    }

    static async addQuantity(req, transaction){
        const stock = await StockMedisModel.findOne({
            where: {
                uuid: req.stock_medis_uuid
            },
            transaction
        });

        await StockMedisModel.update({
            sisa_stok: sequelizeInstance.literal(`sisa_stok + ${req.quantity}`)
        }, {
            where: {
                uuid: req.stock_medis_uuid
            },
            transaction
        });

        return stock;
    }
}