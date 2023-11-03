import { CronJob } from "cron";
import { syncProducts } from "../sync/index.js";
import { sendNotification } from "../routes/tg-notifications.js";

// vendor connection point

const vendorsForSync = async (query) => {
  try {
    await syncProducts("WPS", query);
    await syncProducts("PU", query);
    await syncProducts("HH", query);
    await syncProducts("LS", query);
    await syncProducts("TURN", query);
  } catch (error) {
    throw error;
  }
};

export const syncAllProducts = new CronJob({
  cronTime: "0 6 * * *",
  onTick: async () => {
    try {
      await vendorsForSync();
    } catch (error) {
      sendNotification(`Error during updating syncAllProducts: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

export const syncLowStockProducts = new CronJob({
  cronTime: "0 8,10,12,14,16,18,20,22 * * *",
  onTick: async () => {
    const query = {
      inventory_status: "low",
    };

    try {
      await vendorsForSync(query);
    } catch (error) {
      sendNotification(`Error during updating syncLowStockProducts: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

export const syncMediumStockProducts = new CronJob({
  cronTime: "0 13 * * *",
  onTick: async () => {
    const query = {
      inventory_status: { $in: ["medium", "none"] },
    };

    try {
      await vendorsForSync(query);
    } catch (error) {
      sendNotification(`Error during updating syncMediumStockProducts: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});
