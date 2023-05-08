import express from "express";
import {
  getInventoryProducts,
  updateInventoryProduct,
} from "../routes/pu-inventory.js";
import { bigCommerceInstance, puInstance } from "../instances/index.js";

const getSyncedProducts = async (vendor_id, name, page, pageSize) => {
  return await getInventoryProducts(vendor_id, name, page, pageSize);
};

const getPuProduct = async (id, search) => {
  try {
    let response;
    if (search) {
      let payload = {
        queryString: search,
        pagination: {
          limit: 50,
        },
      };
      response = await puInstance.post("parts/search/", payload);
    } else {
      // get all variants sku's
      const puVariationsResponse = await puInstance.get(
        `parts/${id}/style-variations`
      );
      const styleVariationsOptions =
        puVariationsResponse.data.styleVariationsOptions;

      const incorporatingPartNumbers = styleVariationsOptions.flatMap(
        (option) => option.incorporatingPartNumbers
      );
      // get all variants
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
      response = await puInstance.post(`parts/search/`, payload);
    }
    const items = response.data.result.hits;
    const data = items[0];
    const price =
      data.prices.retail ||
      data.prices.originalRetail ||
      data.prices.originalBase + data.prices.originalBase * 0.35;
    return {
      id: data.product.id,
      price: price,
      variants: items.map((item) => {
        const price =
          item.prices.retail ||
          item.prices.originalRetail ||
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

export const updatePuProducts = (vendor_id, name) => {
  return new Promise(async (resolve, reject) => {
    const pageSize = 50;
    let currentPage = 1;
    let totalPages = 1;
    updateStatus = true;

    while (currentPage <= totalPages) {
      try {
        const response = await getSyncedProducts(vendor_id, name, currentPage, pageSize);

        let productsToProcess = [];
        let totalPagesFromResponse = 1;
        
        if (Array.isArray(response.products)) {
          totalPagesFromResponse = response.totalPages;
          productsToProcess = response.products;
        } else {
          productsToProcess = [response];
        }

        totalPages = totalPagesFromResponse;
        // Loop through each synced product
        for (const syncedProduct of productsToProcess) {
          // Get WPS product data and compare it with the synced product data
          const puProduct = await getPuProduct(
            syncedProduct.variants[0].vendor_id,
            syncedProduct.create_value
          );
          // put product name for same products with different variations
          puProduct.product_name = syncedProduct.product_name;

          const syncedProductData = await getSyncedProduct(
            syncedProduct.vendor_id,
            syncedProduct.product_name
          );
          // Check if an update is needed
          const isPriceUpdated = puProduct.price !== syncedProductData.price;
          const isInventoryUpdated = puProduct.variants.some((puVariant) => {
            // Find the corresponding synced variant using the vendor_id
            const syncedVariant = syncedProductData.variants.find(
              (v) => v.vendor_id === puVariant.id
            );

            // Check if the inventory_level has changed
            return (
              syncedVariant &&
              puVariant.inventory_level !== syncedVariant.inventory_level
            );
          });

          // If an update is needed, update the product and its variants
          if (isPriceUpdated || isInventoryUpdated) {
            try {
              // Update the product
              await updateBigcommerceProduct(syncedProduct.bigcommerce_id, {
                price: puProduct.price,
              });

              // Loop through each variant in the synced product
              for (const syncedVariant of syncedProduct.variants) {
                // Find the corresponding WPS variant using the vendor_id
                const puVariant = puProduct.variants.find(
                  (v) => v.id === syncedVariant.vendor_id
                );

                // Check if the variant price or inventory_level has changed
                const isPriceUpdated =
                  puVariant.price !== syncedVariant.variant_price;
                const isInventoryUpdated =
                  puVariant.inventory_level !== syncedVariant.inventory_level;

                if (isPriceUpdated || isInventoryUpdated) {
                  // Update the product variant
                  await updateBigcommerceProductVariants(
                    syncedProduct.bigcommerce_id,
                    [
                      {
                        id: syncedVariant.bigcommerce_id,
                        price: puVariant.price,
                        inventory_level: puVariant.inventory_level,
                      },
                    ]
                  );
                }
              }

              // Update the synced product status to 'Updated'
              puProduct.status = "Updated";
              await updateSyncedProduct(puProduct);
            } catch (error) {
              // If there's an error, update the synced product status to 'Error'
              puProduct.status = "Error";
              await updateSyncedProduct(puProduct);
            }
          } else {
            // If there's no change, update the synced product status to 'No changes'
            puProduct.status = "No changes";
            await updateSyncedProduct(puProduct);
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
  const vendor_id = req.query.vendor_id;
  const name = req.query.name;
  try {
    await updatePuProducts(vendor_id, name);
    res.send({ status: updateStatus });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncPuProductsRouter };
