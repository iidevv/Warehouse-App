import express from "express";
import { CookieJar } from "tough-cookie";
import axiosOrig from "axios";
import { wrapper } from "axios-cookiejar-support";

const cookieJar = new CookieJar();
const axios = wrapper(axiosOrig.create({ jar: cookieJar }));

const loginUrl = "https://dealer.parts-unlimited.com/api/login";
const searchUrl = "https://dealer.parts-unlimited.com/api/parts/search";

const credentials = {
  username: "hidden",
  password: "hidden",
  dealerCode: "hidden",
};
const login = async () => {
  try {
    await axios.put(loginUrl, credentials, {
      jar: cookieJar,
      withCredentials: true,
    });
    console.log("Успешная авторизация");

    const searchBody = {
      filters: [],
      queryString: "0101-14960",
      filterBreakdowns: [
        "inStockQuantity",
        "fitmentPrecision",
        "category",
        "ridingStyle",
        "brand",
        "partStatus",
        "program",
        "catalogReferences",
        "ridingStyle",
        "hasMediaOfType_image",
        "hasMediaOfType_video",
        "hasMediaOfType_audio",
      ],
      searchResultsType: "parts",
      queryMatchTarget: {
        matchFields: [],
        matchMethod: "FULL_TEXT",
      },
      pagination: {
        limit: 40,
        offset: 0,
      },
      customResultView: {
        include: [
          "categories",
          "specificTexts",
          "adPolicyEnforcement",
          "subCommodity",
          "soldOutForSeason",
        ],
      },
    };

    const response = await axios.post(searchUrl, searchBody, {
      jar: cookieJar,
      withCredentials: true,
    });

    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Ошибка авторизации", error);
    throw error;
  }
};

const router = express.Router();

router.get("/pu-search/", async (req, res) => {
  try {
    const result = await login();
    res.json({ status: "search...", result: result });
  } catch (error) {
    res.status(500).json({ error: error.toString() });
  }
});

export { router as puSearchRouter };
