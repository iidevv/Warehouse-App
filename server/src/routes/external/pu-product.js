import express from "express";
import { bigCommerceInstance } from "../../instances/index.js";
import { puSearchInstance } from "../pu-search.js";

const router = express.Router();

const createbigCommerceProduct = async (data) => {
  const price =
    data.prices.retail ||
    data.prices.originalRetail ||
    data.prices.originalBase + data.prices.originalBase * 0.35;
  let inventoryLevel = data.inventory.locales.reduce(
    (total, local) => total + (local.quantity || 0),
    0
  );
  if (data.access.notForSale || data.access.unavailableForPurchase) {
    inventoryLevel = 0;
  }

  const product = {
    sku: data.partNumber,
    name: data.description,
    type: "physical",
    weight: data.shippingDetails.weight,
    price: price,
    inventory_tracking: "product",
    inventory_level: inventoryLevel,
    brand_name: data.brandName || "",
    categories: [506],
    images: [
      {
        is_thumbnail: true,
        image_url: data.primaryMedia.absoluteUrl,
      },
    ],
  };
  const bigCommerceProduct = await bigCommerceInstance.post(
    "/catalog/products",
    product
  );
  return bigCommerceProduct.data.id;
};

const createProduct = async (sku) => {
  try {
    let payload = {
      queryString: sku,
      pagination: {
        limit: 50,
      },
    };
    // const puProduct = await puInstance.post("parts/search/", payload);
    const puProduct = await puSearchInstance(payload);
    let product = puProduct.data.result.hits.find(
      (product) => product.partNumber === sku
    );
    if (product) {
      return await createbigCommerceProduct(product);
    } else {
      return { error: "Not exist!" };
    }
  } catch (error) {
    console.log(error);
  }
};

const getProduct = async (sku) => {
  try {
    const variant = await bigCommerceInstance.get(
      `/catalog/variants?sku=${sku}`
    );
    if (variant.data.length && variant.data[0].option_values[0]) {
      const id = variant.data[0].product_id;
      const optionId = variant.data[0].option_values[0].option_id;
      const optionValue = variant.data[0].option_values[0].id;
      return {
        link: `/cart.php?action=add&product_id=${id}&qty=1&attribute[${optionId}]=${optionValue}`,
      };
    } else if (variant.data.length) {
      const id = variant.data[0].product_id;
      return {
        link: `/cart.php?action=add&product_id=${id}&qty=1`,
      };
    }

    const response = await createProduct(sku);
    if (typeof response === "number") {
      return { link: `/cart.php?action=add&product_id=${response}&qty=1` };
    } else {
      return response;
    }
  } catch (error) {
    console.log(error);
  }
};

router.get("/product/", async (req, res) => {
  const sku = req.query.sku;
  try {
    const product = await getProduct(sku);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as puExternalProductRouter };
