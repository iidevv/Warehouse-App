import BigCommerce from "node-bigcommerce";
import { Configuration } from "openai";
import axios from "axios";
import { config } from "dotenv";
config();

const clientId = process.env.BIGCOMMERCE_CLIENT_ID;
const accessToken = process.env.BIGCOMMERCE_ACCESS_TOKEN;
const storeHash = process.env.BIGCOMMERCE_STORE_HASH;
const WPSToken = process.env.WPS_TOKEN;
const UPuserId = process.env.PU_USER_ID;
const UPpassword = process.env.PU_PASSWORD;
const UPdealerNumber = process.env.PU_DEALER_NUMBER;
const puAccessToken = process.env.PU_ACCESS_TOKEN;

const useHttps = process.env.USE_HTTPS === "true";

export const bigCommerceInstance = new BigCommerce({
  clientId: clientId,
  accessToken: accessToken,
  storeHash: storeHash,
  responseType: "json",
  callback: useHttps
    ? "https://localhost:3001/auth"
    : "http://localhost:3001/auth",
  headers: { "Accept-Encoding": "*", "Content-Type": "application/json" },
  apiVersion: "v3",
});

export const gptInstance = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

export const wpsInstance = axios.create({
  baseURL: "https://api.wps-inc.com/",
  headers: {
    Authorization: `Bearer ${WPSToken}`,
  },
});

export const puInstance = axios.create({
  baseURL: "https://dealer.parts-unlimited.com/api/",
  timeout: 10000,
});

export const puDropshipInstance = axios.create({
  baseURL: "https://stage-api.lemansplatform.com/api/",
  headers: {
    'api-key': puAccessToken,
    'content-type': 'application/json;charset=UTF-8'
  },
});
