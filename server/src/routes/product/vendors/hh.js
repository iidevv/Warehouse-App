import { JSDOM } from "jsdom";
import axios from "axios";

import { removeDuplicateWords } from "../common.js";
import { readInventoryFile } from "../../../sync-products/ftp.js";
import { generateProductName } from "../../../common/index.js";

const fetchData = async (link) => {
  const { data } = await axios.get(`https://helmethouse.com${link}`);
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
  description = description.trim();

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
        let option = dom.window.document.querySelector(
          `input[value="${item.dataset.opts}"]`
        );
        const name = option ? option.dataset.full : "";
        return {
          name,
          sku: item.dataset.sku,
          inventory_level: +item.dataset.inventory,
          price: +item.dataset.price,
        };
      })
      .filter((item) => item !== undefined);
  }

  return { brand, title, description, variants, videoCode, images };
};

const createProduct = (obj, variantsData, link) => {
  const data = obj.variants[0];
  const additionalData = variantsData.find(
    (row) => row["Part Number"] === data.sku
  );
  const price = data.price;
  const weight = +additionalData["Weight"];
  const variants = obj.variants.map((item, i) => {
    i++;

    let imageUrl = item.image_url ? item.image_url : false;
    const is_default = i === 1 ? true : false;
    const variantAdditional = variantsData.find(
      (row) => row["Part Number"] === data.sku
    );
    const variant = {
      id: item.sku,
      sku: item.sku,
      upc: variantAdditional["UPC"],
      option_values: [],
      price: item.price,
      inventory_level: item.inventory_level,
      is_default: is_default,
    };
    const additionalSize =
      variantAdditional["Size"].trim().length != 0
        ? variantAdditional["Size"]
        : "";
    const additionalColor =
      variantAdditional["Color"].trim().length != 0
        ? variantAdditional["Color"]
        : "";
    if (item.color) {
      variant.option_values.push({
        option_display_name: `Color`,
        label: item.color,
      });
    }
    if (item.size) {
      variant.option_values.push({
        option_display_name: `Size`,
        label: item.size,
      });
    }
    if (!item.color && !item.size && (additionalSize || additionalColor)) {
      variant.option_values.push({
        option_display_name: `${obj.brand} Options`,
        label: additionalSize || additionalColor,
      });
    }
    if (!additionalSize && !additionalColor) {
      variant.option_values.push({
        option_display_name: `${obj.brand} Options`,
        label: obj.brand,
      });
    }
    if (imageUrl) {
      variant.image_url = imageUrl;
    }
    return variant;
  });
  const mainImages = variants
    .map((item, i) => {
      let imageUrl = item.image_url ? item.image_url : false;
      i++;
      const is_thumbnail = i === 1;
      if (imageUrl) {
        return {
          variant_id: item.sku,
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
  const additionalImages = obj.images.map((image, i) => ({
    is_additional: true,
    is_thumbnail: false,
    sort_order: mainImages.length + 1 + i,
    image_url: image,
  }));
  const images = [...mainImages, ...additionalImages];
  const product = {
    vendor: "HH",
    vendor_id: link,
    name: generateProductName(obj.brand, obj.title),
    type: "physical",
    weight,
    price,
    description: obj.description,
    brand_name: obj.brand || "",
    inventory_tracking: "variant",
    variants,
    images: images,
  };
  if (obj.videoCode) {
    product.videos = [
      {
        video_id: obj.videoCode,
      },
    ];
  }
  return product;
};

export const getHHProduct = async (link) => {
  try {
    const htmlContent = await fetchData(link);
    const productData = parseHtmlContent(htmlContent);
    const variantsData = await readInventoryFile("HH");
    const product = createProduct(productData, variantsData, link);
    return product;
  } catch (error) {
    return { error: error };
  }
};
