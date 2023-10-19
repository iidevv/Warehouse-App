import { turnMiddleLayerModel } from "../../../models/turnMiddleLayer.js";
import { extractColorAndSize, standardizeSize } from "../common.js";

const createOptions = (name, description, brand) => {

  const options = [];

  const colorRegex =
    /\b(red|blue|green|yellow|black|white|gray|orange|pink|purple|brown|gold|silver|teal|indigo|violet|tan|cyan|olive|maroon|navy|aquamarine|turquoise|goldenrod|peach|mauve|chartreuse)\b/i;

  const sizeRegexWords =
    /\b(extralarge|double xl|triple xl|quad xl|quint xl|extra-extra small|small|extra small|x-small|medium|large|extra large|x-large|xx-large|extra-extra-extra large|extra-extra large|small-medium|extra large\/2x large|xxl|xxs|xs|sm|s|md|m|med|lg|l|xl|xxlarge|xlarge|2xl|2x|3xl|3x|4xl|4x|5xl|5x|6xl|6x|yl|s-m|xl\/2xl)\b/i;

  const sizeRegexNumbers = /(?<=\b|\s)\d{1,2}x?(?=\b|\s)/i;

  const shortDescriptionRegex = /<strong>.*?<\/strong>(.*?)<\/p>/i;
  const shortDescMatch = description.match(shortDescriptionRegex);
  const targetDescription =
    (shortDescMatch && shortDescMatch[1] && shortDescMatch[1].trim()) || name;

  const colorMatch = targetDescription.match(colorRegex);
  let sizeMatch = targetDescription.match(sizeRegexWords);

  if (!sizeMatch) {
    sizeMatch = targetDescription.match(sizeRegexNumbers);
  }

  // if (colorMatch) {
  //   options.push({
  //     option_display_name: `Color`,
  //     label: colorMatch[0],
  //   });
  // }

  // if (sizeMatch) {
  //   options.push({
  //     option_display_name: `Size`,
  //     label: shortDescMatch[1],
  //   });
  // }

  if (options.length === 0) {
    options.push({
      option_display_name: `${brand} options`,
      label: shortDescMatch[1] || name,
    });
  }

  return options;
};

const fetchData = async (id, search = "") => {
  try {
    let products;
    if (search) {
      products = await turnMiddleLayerModel
        .find({
          $or: [
            { name: { $regex: search, $options: "i" } },
            { sku: { $regex: search, $options: "i" } },
          ],
        })
        .limit(50)
        .lean();
    } else {
      products = await turnMiddleLayerModel.find({ id: id }).lean();
    }
    return {
      info: products[0],
      variants: products,
    };
  } catch (error) {
    console.error("Error fetching TURN data:", error);
    throw error;
  }
};

const createProduct = (obj) => {
  const data = obj.info;

  const description = data.description;

  const variants = obj.variants.map((item) => {
    const options = createOptions(item.name, item.description, data.brand);
    return {
      id: item.id,
      sku: item.sku,
      upc: item.upc,
      option_values: options,
      price: item.price,
      inventory_level: item.inventory_level,
      image_url: item.images[0] || null,
      is_default: true,
    };
  });

  const allVariantImages = obj.variants.flatMap((variant) => variant.images);

  const uniqueImages = [...new Set([...data.images, ...allVariantImages])];

  const images = uniqueImages.map((imageUrl, index) => ({
    is_additional: index > 0,
    is_thumbnail: index === 0,
    sort_order: index,
    image_url: imageUrl,
  }));

  return {
    vendor: "TURN",
    vendor_id: data.id,
    name: data.name,
    type: "physical",
    weight: 0,
    price: data.price,
    description: description,
    brand_name: data.brand,
    inventory_tracking: "variant",
    variants: variants,
    images: images,
    search_available: true,
  };
};

export const getTURNProduct = async (id, search) => {
  try {
    const productData = await fetchData(id, search);
    const product = createProduct(productData);
    return product;
  } catch (error) {
    return { error: error };
  }
};
