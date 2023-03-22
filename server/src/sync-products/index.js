import express from "express";
import {
  bigCommerceInstance,
  serverInstance,
  wpsInstance,
} from "../instances/index.js";

// Define the IDs of the products to update
const getSyncedProducts = async () => {
  return await serverInstance
    .get(`/inventory/products`)
    .then((response) => {
      return response.data.products;
    })
    .catch((error) => {
      return error;
    });
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
      console.log(product.items.data);
      return {
        id: product.id,
        price: +product.items.data[0].list_price,
        variants: product.items.data.map((item) => ({
          id: item.id,
          sku: item.sku,
          price: +item.list_price,
          inventory_level: item.inventory.data.total,
        })),
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

// Define the data to compare before update (id = vendor id)
const getSyncedProduct = async (id) => {
  return await serverInstance
    .get(`/inventory/products?id=${id}`)
    .then((response) => {
      return response.data;
    })
    .catch((error) => {
      return error;
    });
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

const getBigcommerceProduct = async (id) => {
  return await bigCommerceInstance
    .get(`/catalog/products/${id}`)
    .then((response) => {
      return response.data;
    });
};

const syncAndUpdateProducts = async () => {
  try {
    // Fetch the synced products from the server
    const syncedProducts = await getSyncedProducts();

    // Iterate over each synced product
    for (const syncedProduct of syncedProducts) {
      // Fetch the product data from WPS using the vendor_id
      const wpsProduct = await getWPSProduct(syncedProduct.vendor_id);
      let shouldUpdateProduct = false;
      const updatedData = {};

      // Check if the product price has changed
      if (syncedProduct.price !== wpsProduct.price) {
        updatedData.price = wpsProduct.price;
        shouldUpdateProduct = true;
      }

      const updatedVariants = [];
      // Iterate over each synced product variant
      for (const syncedVariant of syncedProduct.variants) {
        // Find the corresponding WPS variant using the vendor_id
        const wpsVariant = wpsProduct.variants.find(
          (v) => v.id === syncedVariant.vendor_id
        );

        // Check if the variant price or inventory_level has changed
        if (
          wpsVariant &&
          (syncedVariant.variant_price !== wpsVariant.price ||
            syncedVariant.inventory_level !== wpsVariant.inventory_level)
        ) {
          updatedVariants.push({
            id: syncedVariant.bigcommerce_id,
            price: wpsVariant.price,
            inventory_level: wpsVariant.inventory_level,
          });
        }
      }

      // Update the BigCommerce product if the price has changed
      if (shouldUpdateProduct) {
        await updateBigcommerceProduct(
          syncedProduct.bigcommerce_id,
          updatedData
        );
      }

      // Update the BigCommerce product variants if the price or inventory_level has changed
      if (updatedVariants.length > 0) {
        await updateBigcommerceProductVariants(
          syncedProduct.bigcommerce_id,
          updatedVariants
        );
      }
    }
  } catch (error) {
    console.error("Error while syncing and updating products:", error);
  }
};

const router = express.Router();

router.get("/sync", async (req, res) => {
  try {
    const syncedProducts = await getWPSProduct(17);
    res.json(syncedProducts);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as SyncProductsRouter };
