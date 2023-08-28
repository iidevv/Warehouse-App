import { createNewDate } from "./../common/index.js";
import { addInventoryProduct, addProductItem } from "../routes/inventory.js";

export const createInventoryProduct = async (
  vendorProduct,
  product,
  status
) => {
  const inventoryProduct = {
    vendor: vendorProduct.vendor,
    vendor_id: vendorProduct.vendor_id,
    bigcommerce_id: product.data.id,
    product_name: vendorProduct.name,
    price: product.data.price,
    variants: product.data.variants.map((variant, i) => ({
      vendor_id: vendorProduct.variants[i].id,
      bigcommerce_id: variant.id,
      variant_price: variant.price,
      inventory_level: variant.inventory_level,
    })),
    last_updated: createNewDate(),
    status: status,
  };
  try {
    const res = await addInventoryProduct(
      vendorProduct.vendor,
      inventoryProduct
    );

    await Promise.all(
      product.data.variants.map(async (item) => {
        const data = {
          item_id: item.id,
          product_id: product.data.id,
          product_name: product.data.name,
          sku: item.sku,
          inventory_level: item.inventory_level,
          price: item.price,
          sale_price: item.sale_price,
          update_status: status.toLowerCase(),
          update_log: "",
          discontinued: false,
        };
        await addProductItem(vendorProduct.vendor, data);
      })
    );

    return "Product synced!";
  } catch (error) {
    console.log(error);
    throw error;
  }
};
