import mongoose from "mongoose";
import paginate from "mongoose-paginate-v2";

const AmazonItemSchema = new mongoose.Schema(
  {
    sku: { type: String, required: true, unique: true, index: true },
    quantity: { type: Number, required: true, min: 0 },
    price: { type: Number, required: true, min: 0 },
  },
  { timestamps: true }
);

AmazonItemSchema.plugin(paginate);

export const amazonItemModel = mongoose.model("amazon-items", AmazonItemSchema);
