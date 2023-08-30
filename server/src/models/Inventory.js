import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

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

const ProductItemSchema = new mongoose.Schema(
  {
    vendor: { type: String, required: true },

    item_id: { type: Number, required: true },
    product_id: { type: Number, required: true },

    product_name: { type: String, required: true },
    sku: { type: String, required: true, unique: true, index: true },

    inventory_level: {
      type: Number,
      required: true,
      min: 0,
      set: function (val) {
        // middleware inventory_status
        if (val <= 3) this.inventory_status = "low";
        else if (val <= 8) this.inventory_status = "medium";
        else this.inventory_status = "high";
        return val;
      },
    },

    inventory_status: {
      type: String,
      required: true,
      enum: ["low", "medium", "high"],
      index: true,
    },

    price: { type: Number, required: true, min: 0 },
    sale_price: { type: Number, required: false, min: 0 },

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

export const ProductItemModel = mongoose.model(
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
