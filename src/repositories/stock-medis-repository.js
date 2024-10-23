import {Op} from "sequelize";
import StockMedisModel from "../models/stock-medis-model.js";

export default class StockMedisRepository {
    static async reduceQuantity(req, t) {
        let remainingQuantity = req.quantity;
        let stock;
        const today = new Date();

        let order = [];

        if (req.metode_pemotongan_stok === "FEFO") {
            order.push(["exp_date", "ASC"]);
        } else if (req.metode_pemotongan_stok === "FIFO") {
            order.push(["created_at", "ASC"]);
        } else {
            order.push(["created_at", "DESC"]);
        }

        while (remainingQuantity > 0) {
            stock = await StockMedisModel.findOne({
                where: {
                    item_medis_uuid: req.item_medis_uuid,
                    sisa_stok: {
                        [Op.gt]: 0
                    },
                    exp_date: {
                        [Op.gt]: today
                    },
                    jenis_stok_uuid : req.jenis_stok_uuid
                },
                lock: t.LOCK.UPDATE,
                order: order,
                transaction: t
            });

            if (!stock) {
                throw new Error(`${req.name} not enough or empty`);
            }

            const newStock = stock.sisa_stok - remainingQuantity;

            if (newStock >= 0) {
                await StockMedisModel.update(
                    {sisa_stok: newStock},
                    {
                        where: {uuid: stock.uuid},
                        transaction: t
                    }
                );
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
                remainingQuantity = Math.abs(newStock);
            }
        }

    }
}