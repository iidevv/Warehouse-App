import express from "express";
import {
  getInventoryProducts,
  updateInventoryProduct,
} from "../routes/inventory.js";
import { bigCommerceInstance, wpsInstance } from "../instances/index.js";

// Define the IDs of the products to update
const getSyncedProducts = async (vendor_id, name, page, pageSize, status) => {
  return await getInventoryProducts(vendor_id, name, page, pageSize, status);
};
// response
// [
//   {
//     _id: "641b30d4b58372ebcde1b593",
//     vendor: "WPS",
//     vendor_id: 17,
//     bigcommerce_id: 1900,
//     product_name: "Genesis Series Fork Spring Kit",
//     price: 223.95,
//     variants: [
//       {
//         vendor_id: 398,
//         bigcommerce_id: 3873,
//         variant_price: 223.95,
//         inventory_level: 11,
//       },
//       {
//         vendor_id: 399,
//         bigcommerce_id: 3874,
//         variant_price: 223.95,
//         inventory_level: 9,
//       },
//       {
//         vendor_id: 400,
//         bigcommerce_id: 3875,
//         variant_price: 223.95,
//         inventory_level: 9,
//       },
//       {
//         vendor_id: 401,
//         bigcommerce_id: 3876,
//         variant_price: 223.95,
//         inventory_level: 4,
//       },
//       {
//         vendor_id: 402,
//         bigcommerce_id: 3877,
//         variant_price: 259.95,
//         inventory_level: 15,
//       },
//       {
//         vendor_id: 403,
//         bigcommerce_id: 3878,
//         variant_price: 259.95,
//         inventory_level: 10,
//       },
//       {
//         vendor_id: 599845,
//         bigcommerce_id: 3879,
//         variant_price: 259.95,
//         inventory_level: 10,
//       },
//     ],
//     last_updated: "2023-03-22T16:46:12.000Z",
//     status: "Created",
//     __v: 0,
//   },
//   {
//     _id: "641b306eb58372ebcde1b58c",
//     vendor: "WPS",
//     vendor_id: 1,
//     bigcommerce_id: 1899,
//     product_name: 'Cy-Chrm Sae Asst. Tray "12H"',
//     price: 355.95,
//     variants: [
//       {
//         vendor_id: 163,
//         bigcommerce_id: 3871,
//         variant_price: 355.95,
//         inventory_level: 0,
//       },
//     ],
//     last_updated: "2023-03-22T16:44:30.000Z",
//     status: "Created",
//     __v: 0,
//   },
//   {
//     _id: "641a1b4daddcd7aafbfbb5d1",
//     vendor: "WPS",
//     vendor_id: 158,
//     bigcommerce_id: 1898,
//     product_name: "5/Pk Rad Shroud Bushing 26Mm O Val Yam",
//     price: 16.3,
//     variants: [
//       {
//         vendor_id: 550,
//         bigcommerce_id: 3869,
//         variant_price: 16.3,
//         inventory_level: 0,
//       },
//     ],
//     last_updated: "2023-03-21T21:02:05.000Z",
//     status: "Created",
//     __v: 0,
//   },
// ];

// Define the data to update the products with (id = vendor id)
const getWPSProduct = async (id) => {
  return await wpsInstance
    .get(`/products/${id}/?include=items.inventory`)
    .then((response) => {
      const product = response.data.data;
      return {
        id: product.id,
        price: +product.items.data[0].list_price,
        variants: product.items.data.map((item) => {
          let is_available = false;
          if (item.inventory.data && +item.list_price !== 0) {
            is_available = true;
          }
          return {
            id: item.id,
            sku: item.sku,
            price: +item.list_price,
            inventory_level: is_available ? item.inventory.data.total : 0,
          };
        }),
      };
    })
    .catch((error) => {
      return error;
    });
};
// response
// {
// 	"id": 17,
// 	"price": 223.95,
// 	"variants": [
// 		{
// 			"id": 398,
// 			"sku": "015-01021",
// 			"price": 223.95,
// 			"inventory_level": 11
// 		},
// 		{
// 			"id": 399,
// 			"sku": "015-01022",
// 			"price": 223.95,
// 			"inventory_level": 9
// 		},
// 		{
// 			"id": 400,
// 			"sku": "015-01023",
// 			"price": 223.95,
// 			"inventory_level": 9
// 		},
// 		{
// 			"id": 401,
// 			"sku": "015-01024",
// 			"price": 223.95,
// 			"inventory_level": 4
// 		},
// 		{
// 			"id": 402,
// 			"sku": "015-01025",
// 			"price": 259.95,
// 			"inventory_level": 15
// 		},
// 		{
// 			"id": 403,
// 			"sku": "015-01026",
// 			"price": 259.95,
// 			"inventory_level": 10
// 		},
// 		{
// 			"id": 599845,
// 			"sku": "015-01027",
// 			"price": 259.95,
// 			"inventory_level": 10
// 		}
// 	]
// }

// Define the data to compare before update
const getSyncedProduct = async (vendor_id, name) => {
  return await getInventoryProducts(vendor_id, name, "", "");
};

// Define update product (id = bigcommerce product id, data = updated data)
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

// Define update productVariants (id = bigcommerce product id, data = updated data)
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

// Define update product, when sync completed (id = vendor id, data)
const updateSyncedProduct = async (data) => {
  return await updateInventoryProduct(data);
};

let updateStatus = false;

// Helper function to process array items in parallel with a limited concurrency
async function asyncForEach(array, callback, concurrency = 5) {
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
}

// Helper function to execute a function with retries
async function executeWithRetry(fn, maxRetries = 3, delay = 2000) {
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
}

export const updateWpsProducts = (vendor_id, name, status) => {
  return new Promise(async (resolve, reject) => {
    const pageSize = 5;
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      try {
        // Get synced products
        const response = await executeWithRetry(() =>
          getSyncedProducts(vendor_id, name, currentPage, pageSize, status)
        );

        let productsToProcess = [];
        let totalPagesFromResponse = 1;

        if (Array.isArray(response.products)) {
          totalPagesFromResponse = response.totalPages;
          productsToProcess = response.products;
        } else {
          productsToProcess = [response];
        }

        totalPages = totalPagesFromResponse;

        // Process products with limited concurrency
        await asyncForEach(productsToProcess, async (syncedProduct) => {
          // Add a delay between requests
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Get WPS product data and compare it with the synced product data
          const wpsProduct = await executeWithRetry(() =>
            getWPSProduct(syncedProduct.vendor_id)
          );
          // put product name for same products with different variations
          wpsProduct.product_name = syncedProduct.product_name;

          const syncedProductData = await executeWithRetry(() =>
            getSyncedProduct(
              syncedProduct.vendor_id,
              syncedProduct.product_name
            )
          );

          // Check if an update is needed
          const isPriceUpdated = wpsProduct.price !== syncedProductData.price;
          const isInventoryUpdated = wpsProduct.variants.some((wpsVariant) => {
            // Find the corresponding synced variant using the vendor_id

            const syncedVariant = syncedProductData.variants.find(
              (v) => v.vendor_id == wpsVariant.id
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
              await executeWithRetry(() =>
                updateBigcommerceProduct(syncedProduct.bigcommerce_id, {
                  price: wpsProduct.price,
                })
              );
              // Loop through each variant in the synced product
              for (const syncedVariant of syncedProduct.variants) {
                // Find the corresponding WPS variant using the vendor_id
                const wpsVariant = wpsProduct.variants.find(
                  (v) => v.id == syncedVariant.vendor_id
                );

                // Check if the variant price or inventory_level has changed
                const isPriceUpdated =
                  wpsVariant.price !== syncedVariant.variant_price;
                const isInventoryUpdated =
                  wpsVariant.inventory_level !== syncedVariant.inventory_level;

                if (isPriceUpdated || isInventoryUpdated) {
                  // Update the product variant
                  await executeWithRetry(() =>
                    updateBigcommerceProductVariants(
                      syncedProduct.bigcommerce_id,
                      [
                        {
                          id: syncedVariant.bigcommerce_id,
                          price: wpsVariant.price,
                          inventory_level: wpsVariant.inventory_level,
                        },
                      ]
                    )
                  );
                }
              }

              // Update the synced product status to 'Updated'
              wpsProduct.status = "Updated";
              await executeWithRetry(() => updateSyncedProduct(wpsProduct));
            } catch (error) {
              // If there's an error, update the synced product status to 'Error'
              wpsProduct.status = "Error";
              await executeWithRetry(() => updateSyncedProduct(wpsProduct));
            }
          } else {
            // If there's no change, update the synced product status to 'No changes'
            wpsProduct.status = "No changes";
            await executeWithRetry(() => updateSyncedProduct(wpsProduct));
          }
        });

        currentPage++;
      } catch (error) {
        console.error("Error updating products:", error);
        break;
      }
    }
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
  const status = req.query.status;
  try {
    await updateWpsProducts(vendor_id, name, status);
    res.send({ status: updateStatus });
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncProductsRouter };
