import express from "express";
import { puInstance } from "../instances/index.js";

const router = express.Router();

const removeDuplicateWords = (title, variation) => {
  const titleWords = new Set(title.toLowerCase().split(" "));
  const variationWords = variation.toLowerCase().split(" ");

  const filteredVariation = variationWords.filter(
    (word) => !titleWords.has(word)
  );

  return filteredVariation.join(" ").toLowerCase().replace(/(^\W+|\W+$)/g, "");
};

const createProduct = (obj) => {
  const data = obj.variants[0];
  const variants = obj.variants;
  let description = "";
  if (obj.info.features[0]) {
    description += "<ul>";
    description += obj.info.features
      .map((item) => {
        return `<li>${item.description}</li>`;
      })
      .join("");
    description += "</ul>";
  }
  const price =
    data.prices.retail ||
    data.prices.originalBase + data.prices.originalBase * 0.35;
  const sortedVariants = variants
    .map((item, i) => {
      const cleanName = removeDuplicateWords(
        data.productName,
        item.description
      );
      const option = cleanName ? cleanName : item.description.toLowerCase();
      const imageUrl = item.primaryMedia
        ? item.primaryMedia.absoluteUrl
        : false;
      i++;
      const inventoryLevel = item.inventory.locales.reduce(
        (total, local) => total + (local.quantity || 0),
        0
      );
      const is_default = i === 1 ? true : false;
      const price =
        item.prices.retail ||
        item.prices.originalBase + item.prices.originalBase * 0.35;
      if (imageUrl) {
        return {
          id: item.partNumber,
          sku: item.partNumber,
          option_values: [
            {
              option_display_name: "Options",
              label: option,
            },
          ],
          price: price,
          inventory_level: inventoryLevel,
          image_url: imageUrl,
          is_default: is_default,
        };
      } else {
        return {
          id: item.partNumber,
          sku: item.partNumber,
          option_values: [
            {
              option_display_name: "Options",
              label: option,
            },
          ],
          price: item.prices.retail,
          inventory_level: inventoryLevel,
          is_default: is_default,
        };
      }
    })
    .sort((a, b) => {
      return a.sku.localeCompare(b.sku);
    });
  const product = {
    vendor: "PU",
    vendor_id: data.product.id,
    name: data.productName,
    type: "physical",
    weight: obj.info.physicalDimensions.weight,
    price: price,
    description: description || "",
    brand_name: data.brandName || "",
    inventory_tracking: "variant",
    variants: sortedVariants,
    images: variants
      .map((item, i) => {
        const imageUrl = item.primaryMedia
          ? item.primaryMedia.absoluteUrl
          : false;
        i++;
        const is_thumbnail = i === 1;
        if (imageUrl) {
          return {
            variant_id: item.partNumber,
            is_thumbnail: is_thumbnail,
            sort_order: i,
            image_url: imageUrl,
          };
        }
      })
      .filter((image) => image),
  };
  return product;
};

const fetchData = async (id) => {
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
    const puVariationItemsResponse = await puInstance.post(
      `parts/search/`,
      payload
    );

    const productData = await puInstance.get(`parts/${id}/`);
    const productInfo = {
      physicalDimensions: productData.data.physicalDimensions,
      features: productData.data.product.features,
    };
    const puProduct = {
      info: productInfo,
      variants: puVariationItemsResponse.data.result.hits,
    };

    // return puProduct;
    return createProduct(puProduct);
  } catch (error) {
    return error;
  }
};

router.get("/product/", async (req, res) => {
  const id = req.query.id;
  try {
    const product = await fetchData(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as puProductRouter };
