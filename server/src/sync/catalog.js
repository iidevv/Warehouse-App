import { delay, getProductItemModel } from "../common/index.js";
import { updateStatusModel } from "../models/updateStatus.js";
import { bigCommerceInstance } from "../instances/index.js";
import { sendNotification } from "../routes/tg-notifications.js";
import { getCatalog } from "../routes/catalog/catalog.js";
import { addProductItem } from "../routes/inventory.js";

// vendor connection point

const VENDORS = ["PU", "WPS", "HH", "LS", "TURN", "TORC"];
const SYNCED_ITEMS = [];

export const syncCatalog = async () => {
  try {
    setSyncCatalogStatus(true, "Syncing catalog...");

    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const response = await bigCommerceInstance.get(
        `/catalog/variants?limit=50&page=${currentPage}`
      );

      const items = response.data;
      const meta = response.meta.pagination;

      const unsyncedItems = await findUnsyncedItems(items);

      if (unsyncedItems.length) {
        await syncItems(unsyncedItems);
      }

      if (SYNCED_ITEMS.length) {
        sendNotification(
          `Synced items (${SYNCED_ITEMS.length}): ${SYNCED_ITEMS.join(", ")}`
        );
        SYNCED_ITEMS.length = 0;
      }

      setSyncCatalogStatus(true, `Page ${currentPage} of ${meta.total_pages}`);
      
      totalPages = meta.total_pages;
      await delay(250);
      currentPage++;
    }

    setSyncCatalogStatus(false, "");
  } catch (error) {
    setSyncCatalogStatus(false, "");
    sendNotification(`syncCatalog error: ${error}`);
  }
};

const findUnsyncedItems = async (items) => {
  const unsyncedItems = [];

  for (const item of items) {
    if (!item.sku) continue;

    const notFoundItem = await findItem(item.sku);
    if (!notFoundItem) {
      unsyncedItems.push(item);
    }
  }

  return unsyncedItems;
};

const findItem = async (sku) => {
  await delay(50);

  for (const vendor of VENDORS) {
    const item = await getProductItemModel(vendor).findOne({ sku });
    if (item) {
      return item;
    }
  }

  return null;
};

const syncItems = async (items) => {
  for (const item of items) {
    await syncItem(item);
  }
};

const syncItem = async (item) => {
  for (const vendor of VENDORS) {
    const catalogItems = await getCatalog(vendor, 0, item.sku);
    if (catalogItems && catalogItems.data[0]?.sku == item.sku) {
      await addItem(vendor, item);
      break;
    }
  }
};

const addItem = async (vendor, item) => {
  try {
    await addProductItem(vendor, {
      item_id: item.id,
      product_id: item.product_id,
      sku: item.sku,
      inventory_level: 0,
      inventory_status: "none",
      price: item.price,
      update_status: "created",
      update_log: "Item synced from catalog",
      discontinued: false,
    });
    SYNCED_ITEMS.push(`${vendor}: ${item.sku}`);
  } catch (error) {
    sendNotification(`Error syncing item: ${item.sku} for vendor: ${vendor}`);
  }
};

const setSyncCatalogStatus = async (isUpdating, updateStatus) => {
  try {
    const doc = await updateStatusModel.findOneAndUpdate(
      {
        _id: "6881c6c07ec7e07ef1e760eb",
      },
      {
        is_updating: isUpdating,
        update_status: updateStatus,
      },
      { new: true }
    );
    return { is_updating: doc.is_updating, update_status: doc.update_status };
  } catch (error) {
    throw error;
  }
};

export const getSyncCatalogStatus = async () => {
  try {
    const doc = await updateStatusModel.findOne({
      _id: "6881c6c07ec7e07ef1e760eb",
    });
    return { is_updating: doc.is_updating, update_status: doc.update_status };
  } catch (error) {
    throw error;
  }
};
