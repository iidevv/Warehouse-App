import BigCommerce from "node-bigcommerce";
import axios from "axios";
import { config } from "dotenv";
config();

const clientId = process.env.BIGCOMMERCE_CLIENT_ID;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const WPSToken = process.env.WPS_TOKEN;

export const serverInstance = axios.create({
  baseURL: "http://localhost:3001",
});

export const bigCommerceInstance = new BigCommerce({
  clientId: clientId,
  accessToken: accessToken,
  storeHash: storeHash,
  responseType: "json",
  callback: "https://localhost:3001/auth",
  headers: { "Accept-Encoding": "*", "Content-Type": "application/json" },
  apiVersion: "v3",
});

export const wpsInstance = axios.create({
  baseURL: "https://api.wps-inc.com/",
  headers: {
    Authorization: `Bearer ${WPSToken}`,
  },
});
