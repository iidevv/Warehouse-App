import express from "express";
import { getSyncedProducts } from "./common.js";
import { bigCommerceInstance } from "../instances/index.js";
import { getProductItemModel } from "../common/index.js";
import { sendNotification } from "../routes/tg-notifications.js";

const router = express.Router();

const findBigcommerceProduct = async (sku) => {
  try {
    const response = await bigCommerceInstance.get(
      `/catalog/variants?sku=${sku}`
    );
    if (response.data[0]) {
      return response.data[0];
    } else {
      return false;
    }
  } catch (error) {
    throw error;
  }
};

const IdsMatch = (syncedProduct, bigcommerceProduct) => {
  if (
    syncedProduct.item_id !== bigcommerceProduct.id ||
    syncedProduct.product_id !== bigcommerceProduct.product_id
  ) {
    return false;
  } else {
    return true;
  }
};

const updateSyncedProduct = async (vendor, bigcommerceProduct) => {
  const Model = getProductItemModel(vendor);
  const { sku, id, product_id } = bigcommerceProduct;

  try {
    const result = await Model.updateOne(
      { sku },
      {
        item_id: id,
        product_id,
      }
    );
    if (result.nModified === 0) {
      sendNotification(`No documents were updated for SKU: ${sku}`);
    }
    return result;
  } catch (error) {
    throw error;
  }
};

export const productMapping = async (vendor, query) => {
  let processedProducts = 0;
  let updatedProducts = 0;
  let page = 1;
  let hasNextPage = 1;
  while (hasNextPage) {
    try {
      const { syncedProducts, nextPage } = await getSyncedProducts(
        vendor,
        query,
        page
      );

      const requestPromises = syncedProducts.map(async (syncedProduct) => {
        try {
          const bigcommerceProduct = await findBigcommerceProduct(
            syncedProduct.sku
          );
          if (!IdsMatch(syncedProduct, bigcommerceProduct)) {
            const result = await updateSyncedProduct(
              vendor,
              bigcommerceProduct
            );
            updatedProducts++;
            return result;
          }
        } catch (error) {
          throw error;
        }
      });

      await Promise.all(requestPromises).catch((err) => console.log(err));

      processedProducts += syncedProducts.length;
      hasNextPage = nextPage;
      console.log(`Updated: ${updatedProducts}`);
      page++;
    } catch (error) {
      console.error("Error mapping products:", error);
      throw error;
    }
  }
  sendNotification(`Products mapped: ${updatedProducts}`);
  return {
    updated: updatedProducts,
  };
};

router.patch("/product-mapping", async (req, res) => {
  const { vendor, query } = req.body;
  try {
    const response = await productMapping(vendor, query);
    res.send(response);
  } catch (error) {
    res.status(500).json({ error });
  }
});

export { router as productMappingRouter };
