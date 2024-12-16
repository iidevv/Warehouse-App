import { generateProductName } from "../../../common/index.js";
import { standardizeSize } from "../common.js";
import { readInventoryFile } from "../../../ftp/index.js";
import { readLSCatalogFile } from "../../../common/ls.js";

const fetchData = async (id) => {
  try {
    const catalog = await readLSCatalogFile();
    const inventory = await readInventoryFile("LS");

    const product = catalog.find((item) => item["Part Number"] === id);

    return { product, inventory, catalog };
  } catch (error) {
    return error;
  }
};

const createProduct = (data) => {
  const inventory = data.inventory.find(
    (row) => row["PartNumber"] === data.product["Part Number"]
  );

  if (!inventory) {
    return { name: "Not found in the inventory sheet" };
  }

  let name = generateProductName("LS2", data.product["Product title"]);

  const price = inventory["RetailPrice"];

  const variant = {
    id: data.product["Part Number"],
    sku: data.product["Part Number"],
    gtin: data.product["EAN"].toString(),
    option_values: [
      {
        option_display_name: "Color",
        label: data.product["Color"],
      },
      {
        option_display_name: "Size",
        label: standardizeSize(data.product["Size"]),
      },
    ],
    price: +inventory["RetailPrice"],
    inventory_level: +inventory["In Stock"],
    is_default: true,
  };

  let variantImage = data.product["Photo 1"];

  if (variantImage && !variantImage.includes("mpgcreative")) {
    variant.image_url = variantImage;
  }

  

  const images = Array.from({ length: 6 }, (_, index) => {
    const key = `Photo ${index + 1}`;
    return data.product[key] && !data.product[key].includes("mpgcreative")
      ? data.product[key]
      : null;
  }).filter((item) => item !== null);

  const description = [
    data.product["Description"],
    data.product["Bullet 1"],
    data.product["Bullet 2"],
    data.product["Bullet 3"],
    data.product["Bullet 4"],
    data.product["Bullet 5"],
  ]
    .filter((item) => item !== null && item !== undefined)
    .join("<br/>");

  const additionalImages = images.map((image, i) => ({
    is_additional: true,
    is_thumbnail: false,
    sort_order: 1 + i,
    image_url: image,
  }));

  const product = {
    vendor: "LS",
    vendor_id: data.product["Part Number"],
    name: name,
    type: "physical",
    weight: 0,
    price: price,
    description: description,
    brand_name: "LS2",
    inventory_tracking: "variant",
    variants: [variant],
    images: additionalImages,
    search_available: true,
  };

  return product;
};

export const getLSProduct = async (id, search) => {
  try {
    const data = await fetchData(id);
    const product = createProduct(data);

    if (search) {
      let searchVariants = data.catalog.filter((item) =>
        item["Product title"].includes(search)
      );

      await Promise.all(
        searchVariants.map((variant) => {
          const variantData = {
            product: variant,
            inventory: data.inventory,
          };
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
