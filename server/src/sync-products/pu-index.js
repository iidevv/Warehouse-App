import express from "express";
import {
  getInventoryProducts,
  updateInventoryProduct,
} from "../routes/pu-inventory.js";
import { bigCommerceInstance, puInstance } from "../instances/index.js";

const getSyncedProducts = async (page, pageSize) => {
  return await getInventoryProducts("", "", page, pageSize);
};

const getPuProduct = async (id) => {
  try {
    // get all variants sku's
    const puVariationsResponse = await puInstance.get(
      `parts/${id}/style-variations`
    );

    const styleVariationsOptions =
      puVariationsResponse.data.styleVariationsOptions;
    const incorporatingPartNumbers = styleVariationsOptions.flatMap(
      (option) => option.incorporatingPartNumbers
    );
    let payload = {
      filters: [
        {
          matches: [
            {
              matches: [
                {
                  path: "partNumber.verbatim",
                  values: incorporatingPartNumbers,
                },
              ],
              operator: "OR",
            },
          ],
          operator: "OR",
        },
      ],
    };
    const response = await puInstance.post(`parts/search/`, payload);
    const items = response.data.result.hits;
    const data = items[0];
    const price =
      data.prices.retail ||
      data.prices.originalBase + data.prices.originalBase * 0.35;
    return {
      id: data.product.id,
      price: price,
      variants: items.map((item) => {
        const price =
          item.prices.retail ||
          item.prices.originalBase + item.prices.originalBase * 0.35;
        const inventoryLevel = item.inventory.locales.reduce(
          (total, local) => total + (local.quantity || 0),
          0
        );
        return {
          id: item.partNumber,
          sku: item.partNumber,
          price: price,
          inventory_level: inventoryLevel,
        };
      }),
    };
  } catch (error) {
    throw error;
  }
};

const getSyncedProduct = async (vendor_id, name) => {
  return await getInventoryProducts(vendor_id, name, "", "");
};

const updateBigcommerceProduct = async (id, data) => {
  return await bigCommerceInstance
    .put(`/catalog/products/${id}`, data)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
};

const updateBigcommerceProductVariants = async (id, variants) => {
  const promises = variants.map((variant) => {
    return bigCommerceInstance
      .put(`/catalog/products/${id}/variants/${variant.id}`, variant)
      .then(() => {
        return `${variant.id} - updated;`;
      })
      .catch(() => {
        return `${variant.id} - error;`;
      });
  });

  const messages = await Promise.all(promises);
  return { message: messages.join(" ") };
};

const updateSyncedProduct = async (data) => {
  return await updateInventoryProduct(data);
};

let updateStatus = false;

export const updatePuProducts = () => {
  return new Promise(async (resolve, reject) => {
    const pageSize = 50;
    let currentPage = 1;
    let totalPages = 1;
    updateStatus = true;

    while (currentPage <= totalPages) {
      try {
        // Get synced products
        const { products: syncedProducts, totalPages: totalPagesFromResponse } =
          await getSyncedProducts(currentPage, pageSize);
        totalPages = totalPagesFromResponse;
        // Loop through each synced product
        for (const syncedProduct of syncedProducts) {
          // Get WPS product data and compare it with the synced product data
          const wpsProduct = await getPuProduct(
            syncedProduct.variants[0].vendor_id
          );
          // put product name for same products with different variations
          wpsProduct.product_name = syncedProduct.product_name;

          const syncedProductData = await getSyncedProduct(
            syncedProduct.vendor_id,
            syncedProduct.product_name
          );
          // Check if an update is needed
          const isPriceUpdated = wpsProduct.price !== syncedProductData.price;
          const isInventoryUpdated = wpsProduct.variants.some((wpsVariant) => {
            // Find the corresponding synced variant using the vendor_id
            const syncedVariant = syncedProductData.variants.find(
              (v) => v.vendor_id === wpsVariant.id
            );

            // Check if the inventory_level has changed
            return (
              syncedVariant &&
              wpsVariant.inventory_level !== syncedVariant.inventory_level
            );
          });

          // If an update is needed, update the product and its variants
          if (isPriceUpdated || isInventoryUpdated) {
            try {
              // Update the product
              await updateBigcommerceProduct(syncedProduct.bigcommerce_id, {
                price: wpsProduct.price,
              });

              // Loop through each variant in the synced product
              for (const syncedVariant of syncedProduct.variants) {
                // Find the corresponding WPS variant using the vendor_id
                const wpsVariant = wpsProduct.variants.find(
                  (v) => v.id === syncedVariant.vendor_id
                );

                // Check if the variant price or inventory_level has changed
                const isPriceUpdated =
                  wpsVariant.price !== syncedVariant.variant_price;
                const isInventoryUpdated =
                  wpsVariant.inventory_level !== syncedVariant.inventory_level;

                if (isPriceUpdated || isInventoryUpdated) {
                  // Update the product variant
                  await updateBigcommerceProductVariants(
                    syncedProduct.bigcommerce_id,
                    [
                      {
                        id: syncedVariant.bigcommerce_id,
                        price: wpsVariant.price,
                        inventory_level: wpsVariant.inventory_level,
                      },
                    ]
                  );
                }
              }

              // Update the synced product status to 'Updated'
              wpsProduct.status = "Updated";
              await updateSyncedProduct(wpsProduct);
            } catch (error) {
              // If there's an error, update the synced product status to 'Error'
              wpsProduct.status = "Error";
              await updateSyncedProduct(wpsProduct);
            }
          } else {
            // If there's no change, update the synced product status to 'No changes'
            wpsProduct.status = "No changes";
            await updateSyncedProduct(wpsProduct);
          }
        }
        currentPage++;
      } catch (error) {
        console.error("Error updating products:", error);
        break;
      }
    }
    updateStatus = false;
    console.log("All Products Updated!");
    resolve();
  });
};

const router = express.Router();

router.get("/sync-status", async (req, res) => {
  res.send({ status: updateStatus });
});

router.get("/sync", async (req, res) => {
  try {
    await updatePuProducts();
    res.send({ status: updateStatus });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncPuProductsRouter };
