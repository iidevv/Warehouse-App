import fs, { createReadStream } from "fs";
import { spClient } from "./../../instances/amazon-instance.js";
import { create } from "xmlbuilder2";
import { parseCSV } from "../../ftp/index.js";
import { amazonItemModel } from "../../models/Channels.js";
import { bigCommerceInstance } from "../../instances/index.js";
import { delay } from "../../common/index.js";
import { sendNotification } from "../tg-notifications.js";
import { readPriceMatchFile } from "./channels.js";

let priceMatchFile;

const convertToAmazonXml = async (items, type) => {
  let messageType = "";
  let messageBody = {};

  if (type === "inventory") {
    messageType = "Inventory";
    messageBody = items.map((item, index) => ({
      MessageID: index + 1,
      OperationType: "Update",
      Inventory: {
        SKU: item.sku,
        Quantity: item.quantity,
        FulfillmentLatency: 2,
      },
    }));
  } else if (type === "pricing") {
    messageType = "Price";
    messageBody = items.map((item, index) => ({
      MessageID: index + 1,
      OperationType: "Update",
      Price: {
        SKU: item.sku,
        StandardPrice: {
          "@currency": "USD",
          "#text": item.price,
        },
      },
    }));
  }

  const feed = {
    AmazonEnvelope: {
      "@xmlns:xsi": "http://www.w3.org/2001/XMLSchema-instance",
      "@xsi:noNamespaceSchemaLocation": "amzn-envelope.xsd",
      Header: {
        DocumentVersion: "1.01",
        MerchantIdentifier: "A1PGZNIWFM4MIO",
      },
      MessageType: messageType,
      PurgeAndReplace: false,
      Message: messageBody,
    },
  };

  const doc = create(feed);
  const xml = doc.end({ prettyPrint: true });
  return xml;
};

const createXmlFile = async (xml, type) => {
  try {
    await fs.promises.writeFile(`./feeds/amazon_${type}_feed.xml`, xml);
    return true;
  } catch (err) {
    sendNotification("Error createXmlFile:", err);
    return false;
  }
};

const getAllItems = async () => {
  let nextPage = 1;
  let items = [];

  while (nextPage) {
    const options = {
      page: nextPage,
      limit: 500,
      lean: true,
      leanWithId: false,
    };
    const response = await amazonItemModel.paginate({}, options);
    const currentItems = response.docs;
    nextPage = response.nextPage;
    items.push(...currentItems);
  }
  return items;
};

const createFeed = async (items, type) => {
  const xml = await convertToAmazonXml(items, type);
  await createXmlFile(xml, type);
};

const readReportFile = async (localPath) => {
  try {
    const file = createReadStream(localPath);
    const results = await parseCSV(file);
    return results.data;
  } catch (err) {
    sendNotification(`readReportFile Error: ${err}`);
    return false;
  }
};

const processItemsInBulk = async (items) => {
  await amazonItemModel.deleteMany({});

  for (let i = 0; i < items.length; i += 100) {
    const chunk = items.slice(i, i + 100);

    const operations = chunk.map((item) => ({
      updateOne: {
        filter: { sku: item["seller-sku"] },
        update: { $set: { quantity: item.quantity, price: item.price } },
        upsert: true,
      },
    }));

    await amazonItemModel.bulkWrite(operations);
  }
};

const updateAmazonItems = async (items) => {
  const operations = items.map((variant) => ({
    updateOne: {
      filter: { sku: variant.sku },
      update: {
        $set: {
          quantity: variant.inventory_level,
          price:
            variant.sale_price || variant.calculated_price || variant.price,
        },
      },
    },
  }));

  try {
    const result = await amazonItemModel.bulkWrite(operations);
    return result;
  } catch (error) {
    sendNotification(`updateAmazonItems error: ${error}`);
  }
};

const matchPrices = async (items) => {
  if (!priceMatchFile) {
    priceMatchFile = await readPriceMatchFile("Amazon");
  }

  if (!priceMatchFile) {
    return items;
  }

  const skuPriceMap = {};

  priceMatchFile.forEach((row) => {
    const puSku =
      typeof row["PUSKU"] === "string" ? row["PUSKU"].replace(/-/g, "") : null;
    const hhSku =
      typeof row["HH SKU"] === "string"
        ? row["HH SKU"].replace(/-/g, "")
        : null;
    const wpsSku =
      typeof row["WPS SKU"] === "string"
        ? row["WPS SKU"].replace(/-/g, "")
        : null;

    const skus = [puSku, hhSku, wpsSku];

    const price = parseFloat(row["originalRetailPrice"]);

    skus.forEach((sku) => {
      if (sku !== undefined && sku !== null) {
        const cleanSku = String(sku).trim();
        if (cleanSku) {
          skuPriceMap[cleanSku] = price;
        }
      }
    });
  });

  const updatedItems = items.map((item) => {
    const sku = item.sku.replace(/-/g, "");
    const matchedPrice = skuPriceMap[sku];
    if (matchedPrice !== undefined) {
      return { ...item, price: matchedPrice, calculated_price: matchedPrice };
    }
    return item;
  });

  return updatedItems;
};

const updateAllAmazonItems = async () => {
  try {
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const response = await bigCommerceInstance.get(
        `/catalog/variants?limit=250&page=${currentPage}`
      );

      const items = response.data;
      const meta = response.meta.pagination;

      const priceMatchedItems = await matchPrices(items);

      await updateAmazonItems(priceMatchedItems);

      totalPages = meta.total_pages;
      await delay(250);
      currentPage++;
    }

    priceMatchFile = null;
  } catch (error) {
    sendNotification(`updateAllAmazonItems error: ${error}`);
  }
};

const uploadFeed = async (type) => {
  try {
    let createdFeedType = "";

    if (type == "inventory")
      createdFeedType = "POST_INVENTORY_AVAILABILITY_DATA";
    if (type == "pricing") createdFeedType = "POST_PRODUCT_PRICING_DATA";

    let feedUploadDetails = await spClient.callAPI({
      operation: "createFeedDocument",
      endpoint: "feeds",
      body: {
        contentType: "text/xml; charset=utf-8",
      },
    });

    await spClient.upload(
      { url: feedUploadDetails.url },
      {
        file: `./feeds/amazon_${type}_feed.xml`,
        contentType: "text/xml; charset=utf-8",
      }
    );

    const response = await spClient.callAPI({
      operation: "createFeed",
      endpoint: "feeds",
      body: {
        marketplaceIds: ["ATVPDKIKX0DER"],
        feedType: createdFeedType,
        inputFeedDocumentId: feedUploadDetails.feedDocumentId,
      },
    });

    return response;
  } catch (error) {
    sendNotification(`uploadFeed error: ${error}`);
  }
};

// add drop files

export const updateAmazonProducts = async () => {
  // await updateAllAmazonItems();

  // get items from db
  const items = await getAllItems();

  await createFeed(items, "pricing");
  await uploadFeed("pricing");

  await createFeed(items, "inventory");
  await uploadFeed("inventory");
};

// add drop db

export const refreshAmazonProducts = async () => {
  // download
  await spClient.downloadReport({
    body: {
      reportType: "GET_MERCHANT_LISTINGS_ALL_DATA",
      marketplaceIds: ["ATVPDKIKX0DER"],
    },
    version: "2021-06-30",
    interval: 8000,
    download: {
      file: "./additional_files/amazon_report.csv",
    },
  });

  // read
  const items = await readReportFile("./additional_files/amazon_report.csv");

  // update
  await processItemsInBulk(items);
};

// router.get("/status", async (req, res) => {
//   try {
//     const status = await spClient.callAPI({
//       operation: "getFeed",
//       endpoint: "feeds",
//       path: {
//         feedId: "51191019771",
//       },
//     });
//     res.json(status);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

// router.get("/documents", async (req, res) => {
//   try {
//     const status = await spClient.callAPI({
//       operation: "getFeedDocument",
//       endpoint: "feeds",
//       path: {
//         feedDocumentId: `amzn1.tortuga.4.na.54e66a87-4b80-4fc7-b650-1e55dfd7b476.T12OB3F9U7N7HM`,
//       },
//     });
//     res.json(status);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });
