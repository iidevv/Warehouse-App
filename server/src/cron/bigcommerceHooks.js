import { CronJob } from "cron";
import { bigCommerceInstance } from "../instances/index.js";
import { sendNotification } from "../routes/tg-notifications.js";

const checkHook = async (id) => {
  try {
    const { data: hook } = await bigCommerceInstance.get(`/hooks/${id}`);
    return { id, is_active: hook.is_active };
  } catch (error) {
    sendNotification(`Hook ${id} error. ${error}`);
  }
};

const activateHook = async (id) => {
  try {
    const { data: hook } = await bigCommerceInstance.put(`/hooks/${id}`, {
      is_active: true,
    });
    return { id, is_active: hook.is_active };
  } catch (error) {
    sendNotification(`Hook ${id} activation error. ${error}`);
  }
};

const updateHooks = async (hookIds) => {
  const hooksPromises = hookIds.map(async (id) => {
    try {
      const { is_active } = await checkHook(id);
      if (!is_active) {
        const { is_active } = await activateHook(id);
        return { id, is_active };
      }
      return { id, is_active };
    } catch (error) {
      sendNotification(`Hook update error ${error}`);
    }
  });

  try {
    const response = await Promise.all(hooksPromises);
    return response;
  } catch (error) {
    sendNotification(`Hooks update error ${error}`);
  }
};

export const updateAllHooks = new CronJob({
  cronTime: "0 6 * * *",
  onTick: async () => {
    try {
      // imgs optimization, delete product
      await updateHooks([26765181, 27186306]);
    } catch (error) {
      sendNotification(`Error during updating: ${error}`);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});
