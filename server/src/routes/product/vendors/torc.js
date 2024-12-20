import { JSDOM } from "jsdom";
import axios from "axios";

import { readInventoryFile } from "../../../ftp/index.js";
import { removeDuplicateWords, standardizeSize } from "../common.js";
import { generateProductName } from "../../../common/index.js";

const searchProduct = async (search) => {
  const { data } = await axios.get(
    `https://www.torchelmets.com/search?q=${search}`
  );
  return data;
};

const fetchData = async (link) => {
  const { data } = await axios.get(`https://www.torchelmets.com${link}`);
  return data;
};

const parseSearchResult = (htmlContent) => {
  const dom = new JSDOM(htmlContent);
  const links = dom.window.document.querySelectorAll(".card__inner a");

  if (!links) return null;

  return Array.from(links).map((link) => {
    return link.href;
  });
};

function fixAndParseJSON(jsonString) {
  // 1. Remove trailing commas
  jsonString = jsonString.replace(/,\s*([\]}])/g, "$1");

  // 2. Ensure property names are quoted (does not fix all cases, use cautiously)
  jsonString = jsonString.replace(/([{,])(\s*)(\w+)\s*:/g, '$1"$3":');

  try {
    // Try to parse the fixed JSON string
    return JSON.parse(jsonString);
  } catch (err) {
    console.error("Error parsing JSON after fixes:", err);
    return null;
  }
}

const parseHtmlContent = (htmlContent) => {
  const dom = new JSDOM(htmlContent);

  const scripts = dom.window.document.querySelectorAll("script");
  let productData = null;

  scripts.forEach((script) => {
    if (script.textContent.includes("KiwiSizing.data")) {
      // Extract the JavaScript object string for KiwiSizing.data using regex
      const regex = /KiwiSizing\.data\s*=\s*({[\s\S]*?});/;
      const match = script.textContent.match(regex);

      if (match && match[1]) {
        try {
          productData = fixAndParseJSON(match[1]);
        } catch (err) {
          console.error("Error parsing KiwiSizing.data:", err);
        }
      }
    }
  });

  if (!productData) return false;

  const title = productData.title;
  const brand = productData.vendor;
  const weight = productData?.variants[0]?.weight / 10 || undefined;
  let description = dom.window.document.querySelector(
    ".product__description"
  )?.innerHTML;

  description = description.trim();

  let images = productData.images;
  images = images?.map((img) => {
    if (img.startsWith("//")) {
      return `https:${img}`;
    }
    return img;
  });

  let variants = productData.variants.map((variant) => {
    const color = !variant.option3
      ? variant.option1
      : `${variant.option2} - ${variant.option1}`;
    const size = !variant.option3 ? variant.option2 : variant.option3;

    return {
      sku: variant.sku,
      price: 0,
      inventory_level: 0,
      color,
      size,
      image_url: images[1],
    };
  });

  return { brand, title, description, variants, images, weight };
};

const createProduct = (obj, variantsData, id) => {
  const data = obj.variants[0];
  const price = data.price;
  const weight = obj.weight;
  const variants = obj.variants
    .map((item, i) => {
      i++;

      const variantAdditional = variantsData.find(
        (row) => row["SKU"] === item.sku
      );

      if (!variantAdditional) return undefined;

      let imageUrl = item.image_url ? item.image_url : false;
      const is_default = i === 1 ? true : false;

      const price = parseFloat(variantAdditional.Price_Retail.replace("$", ""));

      const variant = {
        id: item.sku,
        sku: item.sku,
        upc: variantAdditional["UPC"],
        option_values: [],
        price,
        inventory_level: variantAdditional["Qty Avail Now"],
        is_default: is_default,
      };

      if (item.color) {
        variant.option_values.push({
          option_display_name: `Color`,
          label: item.color,
        });
      }
      if (item.size) {
        variant.option_values.push({
          option_display_name: `Size`,
          label: standardizeSize(item.size),
        });
      }
      if (!item.color && !item.size) {
        variant.option_values.push({
          option_display_name:
            productData["Color"].length > 2 ? "Color" : "Model",
          label:
            productData["Color"].length > 2
              ? productData["Color"]
              : productData["Model"],
        });
      }
      if (imageUrl) {
        variant.image_url = imageUrl;
      }
      return variant;
    })
    .filter(Boolean);

  const mainImages = variants
    .map((item, i) => {
      let imageUrl = item?.image_url ? item?.image_url : false;
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
    vendor: "TORC",
    vendor_id: id,
    name: generateProductName(obj.brand, obj.title),
    type: "physical",
    weight,
    price,
    description: obj.description,
    brand_name: obj.brand || "",
    inventory_tracking: "variant",
    variants,
    images: images,
    search_available: true,
  };

  return product;
};

const createProductFromFile = (id, search, variantsData) => {
  const productData = variantsData.find((row) => row["SKU"] === id);
  const price = parseFloat(productData.Price_Retail.replace("$", ""));
  let variants = [
    {
      id: productData["SKU"],
      sku: productData["SKU"],
      upc: productData["UPC"],
      option_values: [
        {
          option_display_name: "Size",
          label: productData["Size"],
        },
        {
          option_display_name:
            productData["Color"].length > 2 ? "Color" : "Model",
          label:
            productData["Color"].length > 2
              ? productData["Color"]
              : productData["Model"],
        },
      ],
      price,
      inventory_level: productData["Qty Avail Now"],
      is_default: true,
    },
  ];

  if (search) {
    let additionalVariants = variantsData.filter((row) =>
      row["Description"].includes(search)
    );

    const mappedVariants = additionalVariants.map((item, i) => {
      i++;

      const is_default = i === 1;

      const price = parseFloat(item.Price_Retail.replace("$", ""));

      const variant = {
        id: item["SKU"],
        sku: item["SKU"],
        upc: item["UPC"],
        option_values: [
          {
            option_display_name: "Size",
            label: item["Size"],
          },
          {
            option_display_name: item["Color"].length > 2 ? "Color" : "Model",
            label: item["Color"].length > 2 ? item["Color"] : item["Model"],
          },
        ],
        price,
        inventory_level: item["Qty Avail Now"],
        is_default: is_default,
      };

      return variant;
    });
    variants = [...variants, ...mappedVariants];
    variants = variants.filter(
      (variant, index, self) =>
        index === self.findIndex((v) => v.id === variant.id)
    );
  }

  const product = {
    vendor: "TORC",
    vendor_id: id,
    name: generateProductName("TORC", productData["Description"]),
    type: "physical",
    weight: 0,
    price,
    description: "",
    brand_name: "TORC",
    inventory_tracking: "variant",
    variants,
    images: [],
    search_available: true,
  };

  return product;
};

export const getTORCProduct = async (id, search) => {
  try {
    const searchHtmlContent = await searchProduct(search || id);
    const links = parseSearchResult(searchHtmlContent);

    const variantsData = await readInventoryFile("TORC");

    if (!links.length) {
      return createProductFromFile(id, search, variantsData);
    }

    const htmlContent = await fetchData(links[0]);
    const productData = parseHtmlContent(htmlContent);

    let product = createProduct(productData, variantsData, id);

    if (links.length === 1) {
      return product;
    }

    await Promise.all(
      links.map(async (link, i) => {
        if (i === 0) return undefined;

        const htmlContent = await fetchData(link);
        const variantData = parseHtmlContent(htmlContent);
        const variant = createProduct(variantData, variantsData, id);

        const allVariants = [...product.variants, ...variant.variants];

        product.variants = allVariants.filter(
          (variant, index, self) =>
            index === self.findIndex((v) => v.id === variant.id)
        );

        const allImages = [...product.images, ...variant.images];
        product.images = allImages.filter(
          (image, index, self) =>
            index === self.findIndex((img) => img.image_url === image.image_url)
        );
      })
    );
    return product;
  } catch (error) {
    console.log(error);
    return { error: error };
  }
};
