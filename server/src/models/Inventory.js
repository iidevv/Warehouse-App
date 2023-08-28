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

export const InventoryModel = mongoose.model("wps-products", InventorySchema);
export const puInventoryModel = mongoose.model("pu-products", InventorySchema);
export const hhInventoryModel = mongoose.model("hh-products", InventorySchema);
export const lsInventoryModel = mongoose.model("ls-products", InventorySchema);

// new schema

const itemSchema = new mongoose.Schema({
  vendor: { type: String, required: true },
  id: { type: Number, required: true },
  product_id: { type: Number, required: true },
  name: { type: String, required: true },
  sku: { type: String, required: true, unique: true },
  inventory_level: { type: Number, required: true },
  inventory_status: { type: String, required: true }, // low (1-3), medium (4-8), high (9+)
  price: { type: Number, required: true },
  update_date: { type: Date, required: true },
  update_status: { type: String, required: true },
  update_log: String,
  discontinued: Boolean,
  closeout_id: Number,
});
