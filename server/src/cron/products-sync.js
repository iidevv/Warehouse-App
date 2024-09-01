import { CronJob } from "cron";
import { syncProducts } from "../sync/index.js";
import { sendNotification } from "../routes/tg-notifications.js";
import { createNewDate } from "../common/index.js";

// vendor connection point

const vendorsForSync = async (query) => {
  const vendors = ["WPS", "PU", "HH", "LS", "TURN", "TORC"];
  const time = createNewDate();
  for (const vendor of vendors) {
    try {
      await syncProducts(vendor, query);
    } catch (error) {
      sendNotification(
        `Error syncing with ${vendor} (${time}):`,
        error
      );
    }
  }
};

export const syncAllProducts = new CronJob({
  cronTime: "0 6 * * *",
  onTick: async () => {
    const query = {};
    try {
      await vendorsForSync(query);
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
      sendNotification(
        `Error during updating syncMediumStockProducts: ${error}`
      );
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});
