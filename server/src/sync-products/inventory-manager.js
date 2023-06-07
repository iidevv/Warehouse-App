import { createNewDate } from "./../common/index.js";
import { addInventoryProduct } from '../routes/inventory.js';

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
    const res = await addInventoryProduct(inventoryProduct);
    return "Product synced!";
  } catch (error) {
    console.log(error);
    throw error;
  }
};
