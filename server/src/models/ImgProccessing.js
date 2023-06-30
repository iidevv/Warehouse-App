import mongoose from "mongoose";

const ProcessedProductSchema = new mongoose.Schema({
    productId: Number,
});

export const ProcessedProduct = mongoose.model("ProcessedProduct", ProcessedProductSchema);