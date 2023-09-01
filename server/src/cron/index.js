import { config } from "dotenv";
import { updateAllHooks } from "./bigcommerceHooks.js";
import { syncAllProducts, syncLowStockProducts } from "./products-sync.js";
config();
const useHttps = process.env.USE_HTTPS === "true";

if (useHttps) {
  syncAllProducts.start();
  syncLowStockProducts.start();
  updateAllHooks.start();
}
