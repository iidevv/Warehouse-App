import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const ProductItemSchema = new mongoose.Schema(
  {
    vendor: { type: String, required: true },
    item_id: { type: Number, required: true },
    product_id: { type: Number, required: true },
    sku: { type: String, required: true, unique: true, index: true },
    inventory_level: {
      type: Number,
      required: true,
      min: 0,
    },
    inventory_status: {
      type: String,
      required: true,
      enum: ["none", "low", "medium", "high"],
      index: true,
    },
    price: { type: Number, required: true, min: 0 },
    update_status: {
      type: String,
      required: true,
      enum: ["error", "created", "updated", "no changes"],
      index: true,
    },
    update_log: String,
    discontinued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

ProductItemSchema.plugin(paginate);

export const updateProductItemModel = mongoose.model(
  "update-product-items",
  ProductItemSchema
);

// vendor connection point

export const wpsProductItemModel = mongoose.model(
  "wps-product-items",
  ProductItemSchema
);
export const puProductItemModel = mongoose.model(
  "pu-product-items",
  ProductItemSchema
);
export const hhProductItemModel = mongoose.model(
  "hh-product-items",
  ProductItemSchema
);
export const lsProductItemModel = mongoose.model(
  "ls-product-items",
  ProductItemSchema
);
export const turnProductItemModel = mongoose.model(
  "turn-product-items",
  ProductItemSchema
);
