import { createNewDate } from "./../common/index.js";
import { addInventoryProduct } from "../routes/hh-inventory.js";

export const createHhInventoryProduct = async (
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
    create_type: vendorProduct.create_type,
    create_value: vendorProduct.create_value,
  };
  try {
    const res = await addInventoryProduct(inventoryProduct);
    return "Product synced!";
  } catch (error) {
    console.log(error);
    throw error;
  }
};
