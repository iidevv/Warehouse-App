import express from "express";
import { wpsInstance } from '../instances/index.js';

const router = express.Router();

const createProduct = (obj) => {
  const data = obj.data;
  const variants = obj.data.items.data;
  let description = data.description || "";
  if(obj.data.features.data[0]) {
    description += '<ul>';
    description += obj.data.features.data.map((item) =>{
      return `<li>${item.name}</li>`;
    }).join('');
    description += '</ul>';
  }
  const product = {
    vendor: "WPS",
    vendor_id: data.id,
    name: data.name,
    type: "physical",
    weight: variants[0].weight,
    price: variants[0].list_price,
    description: description || "",
    brand_name: variants[0].brand.data.name || "",
    inventory_tracking: "variant",
    variants: variants.map((item, i) => {
      const option = item.name ? item.name.toLowerCase() : "";
      const imageUrl = item.images.data[0]
        ? `https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`
        : 'https://cdn11.bigcommerce.com/s-4n3dh09e13/images/stencil/original/image-manager/dmg-img.jpg';
      i++;
      const is_default = i === 1;
      return {
        id: item.id,
        sku: item.sku,
        option_values: [
          {
            option_display_name: "Options",
            label: option,
          },
        ],
        price: item.list_price,
        inventory_level: item.inventory.data.total,
        image_url: imageUrl,
        is_default: is_default,
      };
    }),
    images: variants.map((item, i) => {
      const imageUrl = item.images.data[0]
        ? `https://${item.images.data[0].domain}${item.images.data[0].path}${item.images.data[0].filename}`
        : 'https://cdn11.bigcommerce.com/s-4n3dh09e13/images/stencil/original/image-manager/dmg-img.jpg';
      i++;
      const is_thumbnail = i === 1;
      return {
        is_thumbnail: is_thumbnail,
        sort_order: i,
        image_url: imageUrl,
      };
    }),
  };
  return product;
};

const fetchData = async (id) => {
  try {
    const wpsProduct = await wpsInstance.get(
      `/products/${id}/?include=features,items.images,items.inventory,items.brand`
    );
    return createProduct(wpsProduct.data);
  } catch (error) {
    return error;
  }
};

router.get("/product/", async (req, res) => {
  const id = req.query.id;
  try {
    const product = await fetchData(id);
    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error });
  }
});

export { router as WPSProductRouter };
