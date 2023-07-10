import express from "express";
import { wpsInstance } from "../instances/index.js";
import { generateProductName } from "../common/index.js";

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
  const data = obj.data;
  const variants = obj.data.items.data;
  let description = data.description || "";
  if (obj.data.features.data[0]) {
    description += "<ul>";
    description += obj.data.features.data
      .map((item) => {
        return `<li>${item.name}</li>`;
      })
      .join("");
    description += "</ul>";
  }

  const mainImages = variants
    .map((item, i) => {
      const imageUrl = item.images.data[0]
        ? `https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`
        : false;
      i++;
      const is_thumbnail = i === 1;
      if (imageUrl) {
        return {
          variant_id: item.id,
          is_thumbnail: is_thumbnail,
          sort_order: i,
          image_url: imageUrl,
        };
      }
    })
    .filter((image) => image);

  const additionalImages = variants
    .flatMap((variant, i) => {
      return variant.images.data.map((image, i) => {
        if (i == 0) return;
        return {
          is_additional: true,
          is_thumbnail: false,
          sort_order: i,
          image_url: `https://${image.domain}${image.path}${image.filename}`,
        };
      });
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

  const images = [...mainImages, ...additionalImages];
  const product = {
    vendor: "WPS",
    vendor_id: data.id,
    name: generateProductName(variants[0].brand.data.name, data.name),
    type: "physical",
    weight: variants[0].weight,
    price: variants[0].list_price,
    description: description || "",
    brand_name: variants[0].brand.data.name || "",
    inventory_tracking: "variant",
    variants: variants.map((item, i) => {
      const cleanName = removeDuplicateWords(data.name, item.name);
      const option = cleanName ? cleanName : item.name.toLowerCase();
      const imageUrl = item.images.data[0]
        ? `https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`
        : false;
      i++;
      const is_default = i === 1 ? true : false;
      let is_available = false;
      if(item.inventory.data && +item.list_price !== 0) {
        is_available = true;
      }

      if (imageUrl) {
        return {
          id: item.id,
          sku: item.sku,
          option_values: [
            {
              option_display_name: `${variants[0].brand.data.name} options`,
              label: option,
            },
          ],
          price: item.list_price,
          inventory_level: is_available ? item.inventory.data.total : 0,
          image_url: imageUrl,
          is_default: is_default,
        };
      } else {
        return {
          id: item.id,
          sku: item.sku,
          option_values: [
            {
              option_display_name: `${variants[0].brand.data.name} options`,
              label: option,
            },
          ],
          price: item.list_price,
          inventory_level: is_available ? item.inventory.data.total : 0,
          is_default: is_default,
        };
      }
    }),
    images: images,
  };
  return product;
};

const fetchData = async (id) => {
  try {
    const wpsProduct = await wpsInstance.get(
      `/products/${id}/?include=features,items.images,items.inventory,items.brand`
    );
    return createProduct(wpsProduct.data);
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

export { router as WPSProductRouter };
