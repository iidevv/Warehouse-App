import { lsInstance } from "../../../instances/ls-instance.js";
import { generateProductName } from "../../../common/index.js";
import { removeDuplicateWords } from "../common.js";

const fetchData = async (id) => {
  try {
    const productData = await lsInstance.get(`/products/${id}`);
    console.log(productData.data.product);
    

    // return product;
  } catch (error) {
    return error;
  }
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

  const price = getPrice(data.prices);
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
      const price = getPrice(item.prices);
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

export const getLSProduct = async (id) => {
  try {
    const productData = await fetchData(id);
    console.log(productData);
    // const product = createProduct(productData);
    // return product;
  } catch (error) {
    return { error: error };
  }
};
