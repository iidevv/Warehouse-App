import mongoose from "mongoose";

const InventorySchema = new mongoose.Schema({
    vendor: {type: String, required: true},
    vendor_id: {type: Number, required: true, unique: true},
    bigcommerce_id: {type: Number, required: true, unique: true},
    product_name: {type: String, required: true, unique: true},
    last_updated: {type: Date, required: true},
    status: {type: String, required: true},
});

export const InventoryModel = mongoose.model("inventory", InventorySchema);