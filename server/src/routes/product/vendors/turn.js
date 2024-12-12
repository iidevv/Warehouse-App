import { turnMiddleLayerModel } from "../../../models/turnMiddleLayer.js";
import { extractColorAndSize, standardizeSize } from "../common.js";

const removeDuplicates = (strings) => {
  if (strings.length === 1) return strings;
  const stringsLength = strings.length;

  // Сразу создаем splitWords и инициализируем duplicatesCounter
  const splitWords = [];
  let longestArrayLength = 0;
  const duplicatesCounter = [];

  strings.forEach((string) => {
    const words = string.split(" ");

    splitWords.push(words);

    if (words.length > longestArrayLength) {
      longestArrayLength = words.length;
    }

    words.forEach((word, index) => {
      if (!duplicatesCounter[index]) {
        duplicatesCounter[index] = word === splitWords[0][index] ? 1 : 0;
      } else if (word === splitWords[0][index]) {
        duplicatesCounter[index]++;
      }
    });
  });

  return strings.map((string) => {
    const words = string.split(" ");
    return words
      .filter((word, index) => duplicatesCounter[index] !== stringsLength)
      .join(" ");
  });
};

const createOptions = (name, brand) => {
  const options = [];

  const colorRegex =
    /\b(red|blue|green|yellow|black|white|gray|orange|pink|purple|brown|gold|silver|teal|indigo|violet|tan|cyan|olive|maroon|navy|aquamarine|turquoise|goldenrod|peach|mauve|chartreuse)\b(?:\/\s*(\b(red|blue|green|yellow|black|white|gray|orange|pink|purple|brown|gold|silver|teal|indigo|violet|tan|cyan|olive|maroon|navy|aquamarine|turquoise|goldenrod|peach|mauve|chartreuse)\b))?/i;

  const sizeRegexWords =
    /\b(extralarge|double xl|triple xl|quad xl|quint xl|extra-extra small|small|extra small|x-small|medium|large|extra large|x-large|xx-large|extra-extra-extra large|extra-extra large|small-medium|extra large\/2x large|xxl|xxs|xs|sm|s|md|m|med|lg|l|xl|xxlarge|xlarge|2xl|2x|3xl|3x|4xl|4x|5xl|5x|6xl|6x|yl|s-m|xl\/2xl)\b/i;

  const sizeRegexNumbers = /Size\s*-\s*(\d{2,3})/i;

  const colorMatch = name.match(colorRegex);
  let sizeMatch = name.match(sizeRegexWords);

  if (!sizeMatch) {
    sizeMatch = name.match(sizeRegexNumbers);
  }

  if (colorMatch) {
    const colorValue = colorMatch[2]
      ? `${colorMatch[1]}/${colorMatch[2]}`
      : colorMatch[1];
    options.push({
      option_display_name: `Color`,
      label: colorValue,
    });
  }

  if (sizeMatch) {
    options.push({
      option_display_name: `Size`,
      label: sizeMatch[1],
    });
  }

  if (options.length === 0) {
    options.push({
      option_display_name: `${brand} options`,
      label: name,
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
    const options = createOptions(item.name, data.brand);
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
