import { promises as fs } from "fs";
import { lsInstance } from "../../../instances/ls-instance.js";
import { generateProductName } from "../../../common/index.js";
import { removeDuplicateWords } from "../common.js";
import { parseXLSX, readInventoryFile } from "../../../sync-products/ftp.js";
import { sendNotification } from "../../tg-notifications.js";

const readAdditionalFile = async () => {
  const localPath = `./additional_files/LS_GTIN.xlsx`;
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

  if (variantsInfo.title.includes("NUMBERS")) {
    const regex = /(?:<p>)?([A-Za-z0-9]+): ([A-Za-z0-9\-]+)(?:<\/p>)?/g;

    for (const match of variantsInfo.description.matchAll(regex)) {
      if (match[1] && match[2]) {
        variants.push({
          size: match[1],
          sku: match[2],
        });
      }
    }
  } else if (variantsInfo.title.includes("PART NUMBER")) {
    const regex = /(?:<p>)([A-Za-z0-9\-]+)(?:<\/p>)?/g;

    for (const match of variantsInfo.description.matchAll(regex)) {
      variants.push({
        sku: match[1],
      });
    }
  }
  let description = "";
  if (obj.data.additionalInfoSections[1]) {
    description = obj.data.additionalInfoSections[1].description;
  }
  const data = obj.variantsData.find(
    (row) => row["PartNumber"] === variants[0].sku
  );
  const price = data["RetailPrice"];
  const sortedVariants = variants.map((item, i) => {
    const data = obj.variantsData.find((row) => row["PartNumber"] === item.sku);
    const additionalData = obj.variantsAdditional.find(
      (row) => row["Part Number"] === item.sku
    );
    let imageUrl = obj.data?.media?.mainMedia?.image?.url || false;
    i++;
    console.log(obj.data.media.items);
    return;
    const is_default = i === 1 ? true : false;
    const variant = {
      id: item.sku,
      sku: item.sku,
      gtin: additionalData["EAN"],
      option_values: [
        {
          option_display_name: `Color`,
          label: additionalData["Color"],
        },
        {
          option_display_name: `Size`,
          label: additionalData["Size"],
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
  });
  return;
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

export const getLSProduct = async (id) => {
  try {
    const productData = await fetchData(id);
    const product = createProduct(productData);
    // return product;
  } catch (error) {
    return { error: error };
  }
};
