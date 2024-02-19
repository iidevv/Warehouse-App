import { SellingPartner } from "amazon-sp-api";
import { config } from "dotenv";
config();

export const spClient = new SellingPartner({
  region: "na",
  refresh_token: process.env.AMAZON_REFRESH,
  credentials: {
    SELLING_PARTNER_APP_CLIENT_ID: process.env.AMAZON_CLIENT_ID,
    SELLING_PARTNER_APP_CLIENT_SECRET: process.env.AMAZON_CLIENT_SECRET,
  },
  // options: {
  //   debug_log: true,
  // },
});
