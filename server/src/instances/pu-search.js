import { CookieJar } from "tough-cookie";
import axiosOrig from "axios";
import { wrapper } from "axios-cookiejar-support";
import { config } from "dotenv";
import { sendNotification } from "../routes/tg-notifications.js";
config();

const cookieJar = new CookieJar();
const axios = wrapper(axiosOrig.create({ jar: cookieJar }));

const loginUrl = "https://dealer.parts-unlimited.com/api/login";
const searchUrl = "https://dealer.parts-unlimited.com/api/parts/search";

const credentials = {
  username: process.env.PU_USER_ID,
  password: process.env.PU_PASSWORD,
  dealerCode: process.env.PU_DEALER_NUMBER,
};

let isLogged = false;
let loginAttempts = 0;

export const puSearchLogin = async () => {
  try {
    await axios.put(loginUrl, credentials, {
      jar: cookieJar,
      withCredentials: true,
    });
    isLogged = true;
    loginAttempts = 0;
  } catch (error) {
    sendNotification(`PU instance. Login error: ${error.message}`);
    isLogged = false;
    loginAttempts++;
    if (loginAttempts >= 3) {
      sendNotification(`PU instance. Max login attempts reached`);
      throw new Error("Max login attempts reached");
    }
    await puSearchLogin();
  }
};

export const puSearchInstance = async (payload) => {
  if (!payload) return;
  
  if (!isLogged) {
    await puSearchLogin();
  }

  try {
    const response = await axios
      .post(searchUrl, payload, {
        jar: cookieJar,
        withCredentials: true,
      })
      .catch((err) => console.log(err));
    if (
      response.data.result.hits &&
      !response.data.result.hits.every((hit) => hit.access)
    ) {
      isLogged = false;
      await puSearchLogin();
    }
    console.log(response.data.request.filters[0].matches[0].matches);
    return response;
  } catch (error) {
    sendNotification(`PU instance. Request error: ${error.message}`);
    throw error;
  }
};
