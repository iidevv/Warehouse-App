import express from "express";
import cors from "cors";
import mongoose from "mongoose";
import { userRouter } from "./routes/users.js";
import { inventoryRouter } from "./routes/inventory.js";
import { WPSInventoryRouter } from "./routes/wps-inventory.js";
import { WPSProductRouter } from "./routes/wps-product.js";

const port = process.env.PORT || 3001;
const dbname = process.env.DB_NAME;
const dbUsername = process.env.DB_USERNAME;
const dbPassword = process.env.DB_PASSWORD;

const app = express();

app.use(express.json());
app.use(cors());

app.use("/auth", userRouter);
app.use("/products", inventoryRouter);
app.use("/wps", WPSInventoryRouter);
app.use("/wps", WPSProductRouter);

mongoose.connect(
  `mongodb+srv://${dbUsername}:${dbPassword}@dmg.eqxtdze.mongodb.net/${dbname}?retryWrites=true&w=majority`
);


app.listen(port, () => console.log("Server started!"));
