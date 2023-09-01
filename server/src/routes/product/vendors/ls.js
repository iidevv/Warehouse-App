import { promises as fs } from "fs";
import { lsInstance } from "../../../instances/ls-instance.js";
import { generateProductName } from "../../../common/index.js";
import { removeDuplicateWords, standardizeSize } from "../common.js";
import { sendNotification } from "../../tg-notifications.js";
import { getCatalog } from "../../catalog/catalog.js";
import { parseXLSX, readInventoryFile } from "../../../ftp/index.js";

const readAdditionalFile = async () => {
  const localPath = `./additional_files/LS.xlsx`;
  try {
    const file = await fs.readFile(localPath);
    const results = await parseXLSX(file);
    return results;
  } catch (err) {
    sendNotification(`LS readAdditionalFile Error: ${err}`);
    return false;
  }
};

const fetchData = async (id) => {
  try {
    const productData = await lsInstance.get(`/products/${id}`);
    const variantsData = await readInventoryFile("LS");
    const variantsAdditional = await readAdditionalFile();
    return { data: productData.data.product, variantsData, variantsAdditional };
  } catch (error) {
    return error;
  }
};

const createProduct = (obj) => {
  let variantsInfo = obj.data.additionalInfoSections[0];
  let variants = [];

  const regex = /[A-Za-z0-9]+-[A-Za-z0-9]+/g;
  let variantsDescription = variantsInfo.description.replace(/\s-/g, "-");
  for (const match of variantsDescription.matchAll(regex)) {
    variants.push({
      sku: match[0].trim(),
    });
  }

  let description = "";
  if (obj.data.additionalInfoSections[1]) {
    description = obj.data.additionalInfoSections[1].description;
  }
  const data = obj.variantsData.find(
    (row) => row["PartNumber"] === variants[0].sku
  );
  if (!data) {
    return { name: "Not found in the inventory sheet" };
  }

  let name = generateProductName("LS2", obj.data.name);
  let colorRegex = new RegExp("-[^-]*-", "i");
  name = name.replace(colorRegex, "-");

  const price = data["RetailPrice"];
  const sortedVariants = variants
    .map((item, i) => {
      const data = obj.variantsData.find(
        (row) => row["PartNumber"] === item.sku
      );
      const additionalData = obj.variantsAdditional.find(
        (row) => row["Part Number"] === item.sku
      );
      if (!data || !additionalData) return;

      let imageUrl = obj.data?.media?.mainMedia?.image?.url || false;
      i++;
      const is_default = i === 1 ? true : false;
      const variant = {
        id: item.sku,
        sku: item.sku,
        gtin: additionalData["EAN"].toString(),
        option_values: [
          {
            option_display_name: `Color`,
            label: additionalData["Color"],
          },
          {
            option_display_name: `Size`,
            label: standardizeSize(additionalData["Size"]),
          },
        ],
        price: +data["RetailPrice"],
        inventory_level: +data["In Stock"],
        is_default: is_default,
      };
      if (imageUrl) {
        variant.image_url = imageUrl;
      }
      return variant;
    })
    .filter((item) => item !== undefined);

  const mainImages = variants
    .map((item, i) => {
      let imageUrl = obj.data?.media?.mainMedia?.image?.url || false;
      i++;
      if (imageUrl) imageUrl = imageUrl.replace("http:", "https:");
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
  const additionalImages = obj.data?.media?.items.map((image, i) => ({
    is_additional: true,
    is_thumbnail: false,
    sort_order: mainImages.length + 1 + i,
    image_url: image.image.url,
  }));
  const images = [...mainImages, ...additionalImages];
  const product = {
    vendor: "LS",
    vendor_id: obj.data.id,
    name: name,
    type: "physical",
    weight: 0,
    price: price,
    description: description || "",
    brand_name: "LS2",
    inventory_tracking: "variant",
    variants: sortedVariants,
    images: images,
    search_available: true,
  };
  return product;
};

export const getLSProduct = async (id, search) => {
  try {
    const productData = await fetchData(id);
    const product = createProduct(productData);
    if (search) {
      let searchVariants = await getCatalog("LS", 0, search);
      await Promise.all(
        searchVariants.data.map(async (variant) => {
          const variantData = await fetchData(variant.id);
          const variantInfo = createProduct(variantData);
          if (!variantInfo) return;
          const allVariants = [...product.variants, ...variantInfo.variants];
          product.variants = allVariants.filter(
            (variant, index, self) =>
              index === self.findIndex((v) => v.id === variant.id)
          );

          const allImages = [...product.images, ...variantInfo.images];
          product.images = allImages.filter(
            (image, index, self) =>
              index ===
              self.findIndex((img) => img.image_url === image.image_url)
          );
        })
      );
    }
    return product;
  } catch (error) {
    return { error: error };
  }
};
