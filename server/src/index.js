import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import url from "url";
import path from "path";
import { bigcommerceRouter } from "./routes/bigcommerce.js";
import { WPSProductsRouter } from "./routes/wps-products.js";
import { WPSProductRouter } from "./routes/wps-product.js";
import { inventoryRouter } from "./routes/inventory.js";
import { SyncProductsRouter } from "./sync-products/index.js";
import { userRouter } from "./routes/user.js";
import { chatgptRouter } from "./routes/chatgpt.js";
import { CronJob } from "cron";
import { updateWpsProducts } from "./sync-products/index.js";
import { authenticate } from "./routes/user.js";
import cookieParser from "cookie-parser";
import { puProductsRouter } from "./routes/pu-products.js";
import { puProductRouter } from "./routes/pu-product.js";
import { puInventoryRouter } from "./routes/pu-inventory.js";
import {
  SyncPuProductsRouter,
  updatePuProducts,
} from "./sync-products/pu-index.js";
import { puExternalProductRouter } from "./routes/external/pu-product.js";
import { puDropshipRouter } from "./routes/pu-dropship.js";
import { dropshipOrderRouter } from "./routes/dropship.js";
import { dashboardRouter } from "./routes/dashboard.js";
import { wpsDropshipRouter } from "./routes/wps-dropship.js";

const __filename = url.fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const port = process.env.PORT || 3001;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;
const useHttps = process.env.USE_HTTPS === "true";
const app = express();
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "../client/build")));
app.use(express.json());

app.use("/external", puExternalProductRouter);

app.use(
  cors({
    origin: useHttps
      ? "https://warehouse.discountmotogear.com"
      : "http://localhost:3000",
    credentials: true,
  })
);

app.use("/api/auth", userRouter);

app.use(authenticate);
app.use("/api/inventory", inventoryRouter);
app.use("/api/inventory", SyncProductsRouter);
app.use("/api/pu-inventory", puInventoryRouter);
app.use("/api/pu-inventory", SyncPuProductsRouter);
app.use("/api/pu-dropship", puDropshipRouter);
app.use("/api/pu", puProductsRouter);
app.use("/api/pu", puProductRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/gpt", chatgptRouter);
app.use("/api/products", bigcommerceRouter);
app.use("/api/wps", WPSProductsRouter);
app.use("/api/wps", WPSProductRouter);
app.use("/api/wps-dropship", wpsDropshipRouter);
app.use("/api/dropship", dropshipOrderRouter);

mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@dmg.eqxtdze.mongodb.net/${dbname}?retryWrites=true&w=majority`
);

const job = new CronJob({
  cronTime: "0 7 * * *",
  onTick: async () => {
    try {
      await updateWpsProducts();
      console.log("WPS products updated.");

      await updatePuProducts();
      console.log("PU products updated.");

      console.log("Updating complete.");
    } catch (error) {
      console.error("Error during updating:", error);
    }
  },
  timeZone: "America/Los_Angeles",
  start: false,
});

if (useHttps) job.start();

app.listen(port, () =>
  console.log(`Server started on http://localhost:${port}`)
);
