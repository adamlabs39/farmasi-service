import sequelizeInstance from "../configurations/sequelize-instance.js";
import LokasiStokSeeder from "./lokasi-stok-seeder.js";
import AturanPakaiSeeder from "./aturan-pakai-seeder.js";
import ItemMedisSeeder from "./item-medis-seeder.js";
import SatuanSeeder from "./satuan-seeder.js";
import PrescriptionSeeder from "./prescription-seeder.js";
import PrescriptionItemSeeder from "./prescription-item-seeder.js";
import PrescriptionItemRacikanSeeder from "./prescription-item-racikan-seeder.js";

export const dbSeeder = async () => {
    const transaction = await sequelizeInstance.transaction();
    try {
        await AturanPakaiSeeder.seed(transaction);
        await LokasiStokSeeder.seed(transaction);
        await ItemMedisSeeder.seed(transaction);
        await SatuanSeeder.seed(transaction);
        await PrescriptionSeeder.seed(transaction);
        await PrescriptionItemSeeder.seed(transaction);
        await PrescriptionItemRacikanSeeder.seed(transaction);
        await transaction.commit();
    } catch (error) {
        await transaction.rollback();
        throw error;
    }
};