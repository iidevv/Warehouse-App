import express from "express";
import { puInstance } from "../instances/index.js";
import { generateProductName } from "../common/index.js";
import { puSearchInstance } from '../instances/pu-search.js';

const router = express.Router();

const removeDuplicateWords = (title, variation) => {
  const titleWords = new Set(title.toLowerCase().split(" "));
  const variationWords = variation.toLowerCase().split(" ");

  const filteredVariation = variationWords.filter(
    (word) => !titleWords.has(word)
  );

  return filteredVariation
    .join(" ")
    .toLowerCase()
    .replace(/(^\W+|\W+$)/g, "");
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
    data.prices.originalRetail ||
    data.prices.originalBase + data.prices.originalBase * 0.35;
  const sortedVariants = variants
    .map((item, i) => {
      const cleanName = removeDuplicateWords(
        data.productName,
        item.description
      );
      const option = cleanName ? cleanName : item.description.toLowerCase();
      let imageUrl = item.primaryMedia ? item.primaryMedia.absoluteUrl : false;
      i++;
      if (imageUrl) imageUrl = imageUrl.replace("http:", "https:");
      let inventoryLevel = item.inventory.locales.reduce(
        (total, local) => total + (local.quantity || 0),
        0
      );

      if (data.access.notForSale || data.access.unavailableForPurchase) {
        inventoryLevel = 0;
      }

      const is_default = i === 1 ? true : false;
      const price =
        item.prices.retail ||
        item.prices.originalRetail ||
        item.prices.originalBase + item.prices.originalBase * 0.35;
      if (imageUrl) {
        return {
          id: item.partNumber,
          sku: item.partNumber,
          option_values: [
            {
              option_display_name: `${data.brandName} options`,
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
          name: option,
          option_values: [
            {
              option_display_name: `${data.brandName} options`,
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
  const mainImages = variants
    .map((item, i) => {
      let imageUrl = item.primaryMedia ? item.primaryMedia.absoluteUrl : false;
      i++;
      if (imageUrl) imageUrl = imageUrl.replace("http:", "https:");
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
    .filter((image) => image)
    .filter((image, index, self) => {
      const urls = self.map((img) => img.image_url);
      const uniqueUrls = new Set(urls);
      return (
        uniqueUrls.has(image.image_url) &&
        urls.indexOf(image.image_url) === index
      );
    });
  const additionalImages = obj.info.images.map((image, i) => ({
    is_additional: true,
    is_thumbnail: false,
    sort_order: mainImages.length + 1 + i,
    image_url: image,
  }));
  const images = [...mainImages, ...additionalImages];
  const product = {
    vendor: "PU",
    vendor_id: data.product.id,
    name: generateProductName(data.brandName, data.productName),
    type: "physical",
    weight: obj.info.physicalDimensions.weight,
    price: price,
    description: description || "",
    brand_name: data.brandName || "",
    inventory_tracking: "variant",
    variants: sortedVariants,
    images: images,
  };
  return product;
};

const fetchData = async (id, search) => {
  try {
    let puVariationItemsResponse;
    if (search) {
      let payload = {
        queryString: search,
        pagination: {
          limit: 50,
        },
      };
      // puVariationItemsResponse = await puInstance.post(
      //   "parts/search/",
      //   payload
      // );
      puVariationItemsResponse = await puSearchInstance(payload);
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
        partActiveScope: "ALL",
      };
      // puVariationItemsResponse = await puInstance.post(
      //   `parts/search/`,
      //   payload
      // );
      puVariationItemsResponse = await puSearchInstance(payload);
    }

    const productData = await puInstance.get(`parts/${id}/`);
    const imageExtensions = [".jpg", ".png", ".webp"];

    const images = productData.data.media
      .flatMap((image) => image.absoluteUrl)
      .filter((imageUrl) =>
        imageExtensions.some((extension) => imageUrl.endsWith(extension))
      )
      .map((imageUrl) => imageUrl.replace("http:", "https:"));
    const productInfo = {
      physicalDimensions: productData.data.physicalDimensions,
      features: productData.data.product.features,
      images: images,
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
  const search = req.query.search;
  try {
    const product = await fetchData(id, search);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as puProductRouter };
