import { serverInstance } from '../instances/index.js';

const createNewDate = () => {
  const options = {
    timeZone: "America/Los_Angeles",
  };
  const date = new Date();
  const dateString = date.toLocaleString("en-US", options);
  return dateString;
};

export const createInventoryProduct = (vendorProduct, product, status) => {
  const inventoryProduct = {
    vendor: vendorProduct.vendor,
    vendor_id: vendorProduct.vendor_id,
    bigcommerce_id: product.data.id,
    product_name: vendorProduct.name,
    price: product.data.price,
    variants: product.data.variants.map((variant,i) => (
        {
            vendor_id: vendorProduct.variants[i].id,
            bigcommerce_id: variant.id,
            variant_price: variant.price,
            inventory_level: variant.inventory_level,
        }
    )),
    last_updated: createNewDate(),
    status: status,
  };
  serverInstance.post("/inventory/products/", inventoryProduct).then((res) => {
    console.log("Product synced!");
  }).catch((error) => {
    console.log(error);
  });
};
