import { generateProductName } from "../../../common/index.js";
import { getPrice } from "../../../common/pu.js";
import { puInstance } from "../../../instances/index.js";
import { puSearchInstance } from "../../../instances/pu-search.js";
import { createOptions, removeDuplicateWords } from "../common.js";

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
      puVariationItemsResponse = await puSearchInstance(payload);
    }

    puVariationItemsResponse = puVariationItemsResponse.data.result.hits;

    puVariationItemsResponse = await Promise.all(
      puVariationItemsResponse.map(async (item) => {
        const itemResponse = await puInstance.get(`/parts/${item.partNumber}`);
        item.upc = itemResponse.data.upc || "";
        return item;
      })
    );
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
    const product = {
      info: productInfo,
      variants: puVariationItemsResponse,
    };

    return product;
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
      const option = createOptions(
        cleanName ? cleanName : item.description.toLowerCase(),
        data.brandName || ""
      );

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
      let variant = {
        id: item.partNumber,
        sku: item.partNumber,
        upc: item.upc,
        option_values: option,
        price: price,
        inventory_level: inventoryLevel,
        image_url: imageUrl,
        is_default: is_default,
      };
      if (imageUrl) {
        variant.image_url = imageUrl;
      }
      return variant;
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

export const getPUProduct = async (id, search) => {
  try {
    const productData = await fetchData(id, search);
    const product = createProduct(productData);
    return product;
  } catch (error) {
    return { error: error };
  }
};
