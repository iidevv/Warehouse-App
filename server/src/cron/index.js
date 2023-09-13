import { config } from "dotenv";
import { updateAllHooks } from "./bigcommerceHooks.js";
import { syncAllProducts, syncLowStockProducts, syncMediumStockProducts } from "./products-sync.js";
config();
const useHttps = process.env.USE_HTTPS === "true";

if (useHttps) {
  syncAllProducts.start();
  syncMediumStockProducts.start();
  syncLowStockProducts.start();
  updateAllHooks.start();
}
