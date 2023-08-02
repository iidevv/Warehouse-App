import axios from "axios";
import express from "express";
import { generateProductName } from "../common/index.js";
import { JSDOM } from "jsdom";

const router = express.Router();

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
          upc: item.upc,
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
          upc: item.upc,
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

const getHtmlContent = async (url) => {
  const { data } = await axios.get(url);
  return data;
};

const parseHtmlContent = (htmlContent) => {
  const dom = new JSDOM(htmlContent);
  const title = dom.window.document.querySelector(".product-name").textContent;
  const brand = dom.window.document.querySelector(".product-brand").textContent;
  let descriptions = dom.window.document.querySelectorAll(".card-body");
  let description = "";

  if (
    descriptions[1] &&
    descriptions[0].innerHTML != descriptions[1].innerHTML
  ) {
    description = descriptions[1].innerHTML;
  }
  if (descriptions[0]) {
    description += descriptions[0].innerHTML;
    description = description.replace(/<meta charset="UTF-8">/g, "");
  }
  let videoCode = dom.window.document.querySelector(".youtube-iframe");
  if (videoCode) videoCode = videoCode.src.split("/embed/")[1].split("?")[0];
  let images = dom.window.document.querySelector(".detail-slider");
  images = [...images.querySelectorAll('a[data-toggle="lightbox"]')].map(
    (img) => {
      return img.href;
    }
  );
  let variants = [];
  let variantsNodeList = dom.window.document.querySelectorAll(
    ".sku-grid-modal div.h4"
  );
  if (variantsNodeList && [...variantsNodeList].length > 0) {
    variants = [...variantsNodeList]
      .map((variantNode, i) => {
        let color = variantNode.textContent;
        console.log(color);
        let itemsNode = variantNode.nextElementSibling; // use nextElementSibling instead of nextSibling
        let previousElement = variantNode.previousElementSibling;
        let imageExist = true;
        let variantThumbnail = previousElement.querySelector("img");
        if (
          !variantThumbnail ||
          (!variantThumbnail.src.endsWith(".png") &&
            !variantThumbnail.src.endsWith(".jpg"))
        )
          imageExist = false;
        if (itemsNode) {
          let items = Array.from(itemsNode.querySelectorAll(".sg-item")).map(
            (item) => {
              let sizeElement = item.querySelector(".sg-size");
              let skuElement = item.querySelector(".sg-sku");
              if (sizeElement && skuElement) {
                // ensure these elements exist
                let size = sizeElement.textContent;
                let sku = skuElement.textContent;
                let data = dom.window.document.querySelector(
                  `[data-sku='${sku}']`
                );
                let price = +data.dataset.price;
                let inventory = +data.dataset.inventory;
                return {
                  sku,
                  price,
                  inventory_level: inventory,
                  color: removeDuplicateWords(title, color),
                  size: `${size}`,
                  image_url: imageExist ? images[i] : null,
                };
              }
            }
          );
          return items;
        }
      })
      .flat();
  } else {
    let items = dom.window.document.querySelectorAll("#product_item option");
    variants = [...items]
      .map((item) => {
        if (!item.dataset.sku) return;
        return {
          sku: item.dataset.sku,
          inventory_level: +item.dataset.inventory,
          price: +item.dataset.price,
        };
      })
      .filter((item) => item !== undefined);
  }

  return { brand, title, description, variants, videoCode, images };
};

router.get("/product/", async (req, res) => {
  const link = req.query.link;
  try {
    const htmlContent = await getHtmlContent(`https://helmethouse.com${link}`);
    const data = parseHtmlContent(htmlContent);
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as hhProductRouter };
