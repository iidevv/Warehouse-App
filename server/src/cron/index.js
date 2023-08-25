import { CronJob } from "cron";
import { sendNotification } from "../routes/tg-notifications.js";
import { updateProducts } from "../sync-products/index.js";
import { config } from "dotenv";
import { updateHooks } from "./bigcommerceHooks.js";
config();
const useHttps = process.env.USE_HTTPS === "true";

const updateAllProducts = new CronJob({
  cronTime: "0 7,14,18 * * *",
  onTick: async () => {
    try {
      await updateProducts("WPS");
      await updateProducts("PU");
      await updateProducts("HH");
      await updateProducts("LS");
    } catch (error) {
      sendNotification(`Error during updating: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

const updateAllHooks = new CronJob({
  cronTime: "0 7 * * *",
  onTick: async () => {
    try {
      await updateHooks([26765181]);
    } catch (error) {
      sendNotification(`Error during updating: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

if (useHttps) {
  updateAllProducts.start();
  updateAllHooks.start();
}
