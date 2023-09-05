import {
  lsProductItemModel,
  hhProductItemModel,
  wpsProductItemModel,
  puProductItemModel,
} from "../models/Inventory.js";

// Helper function to process array items in parallel with a limited concurrency
export const asyncForEach = async (array, callback, concurrency = 5) => {
  const queue = [...array];
  const promises = [];
  while (queue.length) {
    while (promises.length < concurrency && queue.length) {
      const item = queue.shift();
      promises.push(callback(item));
    }
    await Promise.race(promises).then((completed) => {
      promises.splice(promises.indexOf(completed), 1);
    });
  }
  return Promise.all(promises);
};

// Helper function to execute a function with retries
export const executeWithRetry = async (fn, maxRetries = 3, delay = 5000) => {
  let retries = 0;
  while (retries < maxRetries) {
    try {
      return await fn();
    } catch (error) {
      retries++;
      console.error(`Attempt ${retries} failed. Retrying...`, error);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
  throw new Error("Max retries reached.");
};

export const createNewDate = () => {
  const options = {
    timeZone: "America/Los_Angeles",
  };

  const date = new Date();
  const sixHoursInMilliseconds = 7 * 60 * 60 * 1000; // 6 hours * 60 minutes * 60 seconds * 1000 milliseconds
  const adjustedDate = new Date(date.getTime() + sixHoursInMilliseconds);
  const dateString = adjustedDate.toLocaleString("en-US", options);

  return dateString;
};

export const generateProductName = (brand, name) => {
  // Remove duplicate brand name
  name = name.replace(new RegExp(brand, "gi"), "");

  // combine name
  name = `${brand} ${name}`;

  // Remove double spaces
  name = name.replace(/\s{2,}/g, " ");

  // Trim any leading/trailing white spaces
  name = name.trim();

  return name;
};

export const getInventoryModel = (vendor) => {
  let model;
  switch (vendor) {
    case "PU":
      model = puInventoryModel;
      break;
    case "WPS":
      model = InventoryModel;
      break;
    case "HH":
      model = hhInventoryModel;
      break;
    case "LS":
      model = lsInventoryModel;
      break;

    default:
      break;
  }
  return model;
};

export const getProductItemModel = (vendor) => {
  let model;
  switch (vendor) {
    case "PU":
      model = puProductItemModel;
      break;
    case "WPS":
      model = wpsProductItemModel;
      break;
    case "HH":
      model = hhProductItemModel;
      break;
    case "LS":
      model = lsProductItemModel;
      break;

    default:
      break;
  }
  return model;
};

export const getInventoryStatus = (inventory_level) => {
  if (inventory_level <= 3) return "low";
  if (inventory_level <= 8) return "medium";
  return "high";
};
