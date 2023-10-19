import { turnMiddleLayerModel } from "../../../models/turnMiddleLayer.js";
import { extractColorAndSize, standardizeSize } from "../common.js";

const extractDescriptionOrName = (description, name) => {
  const regex = /<strong>product description - short<\/strong>\s*(.*?)<\/p>/i;
  const match = description.match(regex);

  if (match && match[1]) {
    return match[1].trim();
  }
  return name;
};

const createOptions = (name, description, brand) => {
  const options = [];
  const extractedNameOrDescription = extractDescriptionOrName(
    description,
    name
  );
  const extractedOptions = extractColorAndSize(extractedNameOrDescription);
  if (extractedOptions.options) {
    options.push({
      option_display_name: `${brand} options`,
      label: extractedOptions.options,
    });
  }
  if (extractedOptions.color) {
    options.push({
      option_display_name: `Color`,
      label: extractedOptions.color,
    });
  }
  if (extractedOptions.size) {
    options.push({
      option_display_name: `Size`,
      label: standardizeSize(extractedOptions.size),
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
