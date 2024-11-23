import { CronJob } from "cron";
import {
  addNewItemsInDatabase,
  updateInventoryInDatabase,
  updatePricesInDatabase,
} from "../middleLayer/turnMiddleLayer.js";
import { sendNotification } from "../routes/tg-notifications.js";

export const syncTurnLayerPrices = new CronJob({
  cronTime: "0 5 * * *",
  onTick: async () => {
    try {
      await updatePricesInDatabase();
    } catch (error) {
      sendNotification(`Turn updatePricesInDatabase error: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

export const syncTurnLayerInventory = new CronJob({
  cronTime: "0 * * * *",
  onTick: async () => {
    try {
      await updateInventoryInDatabase();
    } catch (error) {
      sendNotification(`Turn updateInventoryInDatabase error: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

export const syncTurnLayerProducts = new CronJob({
  cronTime: "0 4 * * *",
  onTick: async () => {
    try {
      await addNewItemsInDatabase();
    } catch (error) {
      sendNotification(`Turn addNewItemsInDatabase error: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});
