import puppeteer from "puppeteer";
import { config } from "dotenv";
config();

const url = "https://turn14.com/";
let page;

const ITEMS_PER_PAGE = 25;
const CLOSE_DELAY = 300000;

let closeTimer = null;

const closeBrowserAfterInactivity = async (browser, delay = CLOSE_DELAY) => {
  if (closeTimer) {
    clearTimeout(closeTimer);
  }
  closeTimer = setTimeout(async () => {
    if (browser) {
      await browser.close();
      browserInstance = null;
    }
  }, delay);
};

let browserInstance;

const initializeBrowser = async () => {
  if (!browserInstance) {
    browserInstance = await puppeteer.launch({ headless: true });
  }
  return browserInstance;
};

const searchLogin = async (page) => {
  await page.click("#CybotCookiebotDialogBodyButtonAccept");

  await page.type('input[name="username"]', process.env.TURN_USERNAME);
  await page.type('input[name="password"]', process.env.TURN_PASSWORD);
  await page.waitForTimeout(500);
  await page.click('#login button[type="submit"]');
  await page.waitForSelector(".logout.pull-right");
};

const getUrlForPage = (search, page, useKeyword = false) => {
  const searchParam = useKeyword ? "vmmKeyword" : "vmmPart";
  return `https://turn14.com/search/index.php?${searchParam}=${search}&start=${
    page * ITEMS_PER_PAGE
  }`;
};

const getItems = async (page) => {
  return await page.$$eval("div[data-itemcode]", (divs) =>
    divs.map((div) => {
      const id = +div.getAttribute("data-itemcode");
      const nameElement = div.querySelector(".partNo");
      const name = nameElement ? nameElement.textContent : null;

      let price = null;
      const priceContainer = div.querySelector(
        ".price-table .inner-price-table"
      );
      if (priceContainer) {
        const labels = Array.from(
          priceContainer.querySelectorAll("div.col-xs-8 > strong")
        );
        const values = Array.from(priceContainer.querySelectorAll("div.value"));
        for (let i = 0; i < labels.length; i++) {
          if (labels[i]?.textContent?.trim() === "Retail") {
            price = values[i]
              ? +values[i].textContent.trim().replace("$", "")
              : null;
            break;
          }
        }
      }

      const inventoryElement = div.querySelector(".stock-line");
      const inventory = inventoryElement
        ? +inventoryElement.textContent.split(" ")[0]
        : null;

      return {
        id: id,
        name: name,
        url: `/product/${id}?vendor=TURN`,
        sku: name ? name.replace("Part #:", "").trim() : null,
        image_url: div.querySelector("img.product-info")?.src || null,
        price: price,
        inventory: inventory,
      };
    })
  );
};

const getTotalPages = async (page) => {
  const lastPageElement = await page.$(".pagination li:last-child a");
  if (lastPageElement) {
    const hrefValue = await lastPageElement.evaluate((el) =>
      el.getAttribute("href")
    );

    if (hrefValue.includes("start=")) {
      const startValue = hrefValue.split("start=")[1].split("&")[0];
      return parseInt(startValue, 10);
    } else if (hrefValue.includes("#")) {
      return null;
    }
  }
  throw new Error("Cannot determine the total pages.");
};

export const turnSearch = async (offset = 1, search = "") => {
  if (!offset || offset == "null") offset = 1;
  offset = parseInt(offset, 10);

  let catalog = {};
  const browser = await initializeBrowser();

  if (!page) {
    page = await browser.newPage();
  }

  await page.goto(url);

  const isLoggedOut = await page.$(".logout.pull-right");
  if (!isLoggedOut) {
    await searchLogin(page);
  }

  await page.goto(getUrlForPage(search, offset));
  const noResults = await page.$("div[data-itemcode]");

  if (noResults === null) {
    await page.goto(getUrlForPage(search, offset, true));
  }
  catalog.data = await getItems(page);

  const totalPages = await getTotalPages(page);

  catalog.meta = {
    current: offset,
    next: offset < totalPages ? offset + 1 : null,
    prev: offset > 1 ? offset - 1 : null,
    total: totalPages,
  };

  await closeBrowserAfterInactivity(browser);

  return catalog;
};
