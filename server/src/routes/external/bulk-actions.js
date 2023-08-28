import express from "express";
import { bigCommerceInstance, wpsInstance } from "../../instances/index.js";
import { createOptions, standardizeSize } from "../product/common.js";
import { addProductItem, getInventoryProducts } from "../inventory.js";
import { sendNotification } from "../tg-notifications.js";
import { puSearchInstance } from "../../instances/pu-search.js";

const router = express.Router();

async function executeWithRetry(fn, maxRetries = 3, delay = 10000) {
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

const createOption = async (productId, optionName, optionValues, sortOrder) => {
  console.log(optionValues);
  try {
    const response = await bigCommerceInstance.post(
      `/catalog/products/${productId}/options`,
      {
        name: optionName,
        display_name: optionName,
        type: "rectangles",
        option_values: [
          {
            label: optionValues,
            sort_order: sortOrder,
          },
        ],
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error createOption", error);
    throw error;
  }
};

const createOptionValue = async (productId, optionId, label, sortOrder) => {
  try {
    console.log(label);
    const response = await bigCommerceInstance.post(
      `/catalog/products/${productId}/options/${optionId}/values`,
      {
        label: label,
        sort_order: sortOrder,
      }
    );
    return response.data;
  } catch (error) {
    console.log("Error createOptionValue", error);
    throw error;
  }
};

const getProductOptions = async (productId) => {
  try {
    const response = await bigCommerceInstance.get(
      `/catalog/products/${productId}/options`
    );
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.log("Error getProductOptions", error);
    throw error;
  }
};

const updateVariantOptions = async (productId, variantId, options) => {
  try {
    let allOptions;
    const existVariant = await bigCommerceInstance.get(
      `/catalog/products/${productId}/variants/${variantId}`
    );
    allOptions = [...existVariant.data.option_values, ...options];
    console.log("request: ", allOptions);
    const response = await bigCommerceInstance.put(
      `/catalog/products/${productId}/variants/${variantId}`,
      {
        option_values: allOptions,
      }
    );
    console.log("response: ", response.data.option_values);
  } catch (error) {
    console.error(`Failed to update variant: ${variantId} - ${error}`);
    throw error;
  }
};

// router.get("/bulk-action-one/", async (req, res) => {
//   const pageSize = 5;
//   let currentPage = 1;
//   let totalPages = 1;

//   try {
//     while (currentPage <= totalPages) {
//       const products = await bigCommerceInstance
//         .get(
//           `/catalog/products?limit=${pageSize}&page=${currentPage}&id:in=4957`
//         )
//         .catch((err) => console.log(err));

//       const productsToProcess = products.data;
//       totalPages = products.meta.pagination.total_pages;

//       await Promise.all(
//         productsToProcess.map(async (product) => {
//           try {
//             const brand = product.name.split(" ")[0];

//             const variants = await bigCommerceInstance.get(
//               `/catalog/products/${product.id}/variants`
//             );

//             const existingOptions = await getProductOptions(product.id);
//             await Promise.all(
//               variants.data.map(async (variant, i) => {
//                 if (i >= 1) return;
//                 if (variant.option_values.length === 1) {
//                   let newOptions = createOptions(
//                     variant.option_values[0].label,
//                     brand
//                   );
//                   let optionExists = [];
//                   let sortOrder = 0;
//                   for (let option of newOptions) {
//                     let optionFound = existingOptions.find(
//                       (opt) => opt.display_name === option.option_display_name
//                     );
//                     if (!optionFound) {
//                       const createdOption = await createOption(
//                         product.id,
//                         option.option_display_name,
//                         option.label,
//                         sortOrder
//                       );
//                       await createOptionValue(
//                         product.id,
//                         createdOption.id,
//                         option.label,
//                         sortOrder
//                       );
//                       sortOrder++;
//                     } else {
//                       optionExists.push(optionFound);
//                       console.log(
//                         `Option ${option.option_display_name} already exists for product ${product.id}`
//                       );
//                     }
//                   }
//                   newOptions = newOptions.map((option) => {
//                     console.log(option);
//                     const existOption = optionExists.find(
//                       (opt) => opt.display_name === option.option_display_name
//                     );
//                     option.id = existOption.id;
//                     return option;
//                   });
//                   console.log(newOptions);
//                   await updateVariantOptions(
//                     product.id,
//                     variant.id,
//                     newOptions
//                   );
//                 }
//               })
//             );

//             await new Promise((resolve) => setTimeout(resolve, 2000));
//           } catch (error) {
//             console.error(
//               `Failed to process product: ${product.id} - ${error}`
//             );
//           }
//         })
//       );
//       console.log(`current page: ${currentPage}`);
//       currentPage++;
//     }

//     res.json({ success: true });
//   } catch (error) {
//     res.json({ error: error.message });
//   }
// });

router.get("/bulk-action-newdb/", async (req, res) => {
  const vendor = req.query.vendor;
  if (!vendor) return res.json({ error: "Vendor not provided" });

  const pageSize = 10;
  let currentPage = 1;
  let totalPages = 1;
  let totalProducts = 0;
  let totalProductItems = 0;
  try {
    while (currentPage <= totalPages) {
      const products = await getInventoryProducts(
        vendor,
        null,
        null,
        currentPage,
        pageSize,
        null,
        null,
        false
      );

      const productsToProcess = products.products;
      totalPages = products.totalPages;

      await asyncForEach(
        productsToProcess,
        async (product) => {
          try {
            // const incorporatingPartNumbers = product.variants.map((item) => {
            //   return item.vendor_id;
            // });

            // let puVariationItemsResponse = await puSearchInstance(payload);
            // puVariationItemsResponse =
            //   puVariationItemsResponse.data.result.hits;

            await Promise.all(
              product.variants.map(async (item) => {
                const data = {
                  item_id: item.bigcommerce_id,
                  product_id: product.bigcommerce_id,
                  product_name: product.product_name,
                  sku: item.vendor_id,
                  inventory_level: item.inventory_level,
                  price: item.variant_price,
                  sale_price: null,
                  update_status: product.status.toLowerCase(),
                  update_log: "",
                  discontinued: false,
                };
                // const itemAdditional = puVariationItemsResponse.find((v) => {
                //   return v.partNumber == item.vendor_id;
                // });
                // if (!itemAdditional) {
                //   sendNotification(
                //     `Page: ${currentPage}. ${product.product_name}. No Additional. Item id: ${item.bigcommerce_id} Prod id: ${product.bigcommerce_id}`
                //   );
                // }

                // data.discontinued =
                //   itemAdditional.status == "DISCONTINUED" ? true : false;
                totalProductItems++;
                await addProductItem(vendor, data);
              })
            );
            totalProducts++;
            await new Promise((resolve) => setTimeout(resolve, 1000));
          } catch (error) {
            console.error(
              `Failed to process product: ${product.product_name} - ${error}`
            );
          }
        },
        5
      );
      console.log(`current page: ${currentPage}. Items: ${totalProductItems}`);
      currentPage++;
    }
    console.log(`Total products: ${totalProducts}`);
    res.json({ success: true });
  } catch (error) {
    res.json({ error: error.message });
  }
});

export { router as bulkActionRouter };
