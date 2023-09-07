import { CronJob } from "cron";
import { syncProducts } from "../sync/index.js";

const vendorsForSync = async (query) => {
  await syncProducts("WPS", query);
  await syncProducts("PU", query);
  await syncProducts("HH", query);
  await syncProducts("LS", query);
};

export const syncAllProducts = new CronJob({
  cronTime: "0 7 * * *",
  onTick: async () => {
    try {
      await vendorsForSync();
    } catch (error) {
      sendNotification(`Error during updating: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

export const syncLowStockProducts = new CronJob({
  cronTime: "0 10,13,16,19,21 * * *",
  onTick: async () => {
    const query = {
      inventory_status: "low",
    };

    try {
      await vendorsForSync(query);
    } catch (error) {
      sendNotification(`Error during updating: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});
