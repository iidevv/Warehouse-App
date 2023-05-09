import mongoose from "mongoose";

const variantSchema = new mongoose.Schema({
  vendor_id: String,
  bigcommerce_id: Number,
  variant_price: Number,
  inventory_level: Number,
});

const InventorySchema = new mongoose.Schema({
  vendor: { type: String, required: true },
  vendor_id: { type: String, required: true },
  bigcommerce_id: { type: Number, required: true },
  product_name: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  variants: [variantSchema],
  last_updated: { type: Date, required: true },
  status: { type: String, required: true },
  create_type: { type: String, required: true },
  create_value: { type: String, required: false },
});

export const puInventoryModel = mongoose.model("pu-products", InventorySchema);

const productSchema = new mongoose.Schema({
  vendor_id: { type: String, required: true },
  bigcommerce_id: { type: Number, required: true },
  sku: { type: String, required: true, unique: true },
  price: { type: Number, required: true },
  inventory_level: Number,
  last_updated: { type: Date, required: true },
  status: { type: String, required: true },
});

export const puProductModel = mongoose.model("pu_products", productSchema);