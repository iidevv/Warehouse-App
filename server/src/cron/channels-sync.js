import { CronJob } from "cron";
import { sendNotification } from "../routes/tg-notifications.js";
import { createNewDate } from "../common/index.js";
import { updateProducts } from "../routes/channels/channels.js";


const channelsForSync = async () => {
  const vendors = ["AMAZON"];
  const time = createNewDate();
  for (const vendor of vendors) {
    try {
      await updateProducts(vendor);
    } catch (error) {
      sendNotification(
        `Error syncing with ${vendor} (${time}):`,
        error
      );
    }
  }
};

export const syncAllChannels = new CronJob({
  cronTime: "30 7,11,16,21 * * *",
  onTick: async () => {
    try {
      await channelsForSync();
    } catch (error) {
      sendNotification(`Error during updating syncAllChannels: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

