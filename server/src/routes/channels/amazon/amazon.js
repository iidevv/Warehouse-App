import fs, { createReadStream } from "fs";
import express from "express";
import { create } from "xmlbuilder2";
import { spClient } from "../../../instances/amazon-instance.js";
import { sendNotification } from "../../tg-notifications.js";
import { parseCSV } from "../../../ftp/index.js";
import { amazonItemModel } from "../../../models/Channels.js";
import { bigCommerceInstance } from "../../../instances/index.js";
import { delay } from "../../../common/index.js";

const router = express.Router();

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
    console.log("File has been saved.");
    return true;
  } catch (err) {
    console.error("Error writing file:", err);
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

router.post("/create-feed", async (req, res) => {
  try {
    const items = await getAllItems();
    await createFeed(items, "pricing");
    await createFeed(items, "inventory");
    res.json({ success: true });
  } catch (error) {
    res.status(500).json(error);
  }
});

// const response = await spClient.callAPI({
//   operation: "getReports",
//   endpoint: "reports",
//   query: {
//     reportType: "GET_MERCHANT_LISTINGS_ALL_DATA",
//     marketplaceIds: ["ATVPDKIKX0DER"],
//   },
// });

router.get("/items", async (req, res) => {
  try {
    let feed_upload_details = await spClient.callAPI({
      operation: "createFeedDocument",
      endpoint: "feeds",
      body: {
        contentType: "text/xml; charset=utf-8",
      },
    });
    console.log(feed_upload_details);
    let uploadRes = await spClient.upload(
      { url: feed_upload_details.url },
      {
        file: "./feeds/amazon_pricing_feed.xml", //amazon_inventory_feed / amazon_pricing_feed
        contentType: "text/xml; charset=utf-8",
      }
    );
    console.log(uploadRes);
    let feed_creation_infos = await spClient.callAPI({
      operation: "createFeed",
      endpoint: "feeds",
      body: {
        marketplaceIds: ["ATVPDKIKX0DER"],
        feedType: "POST_PRODUCT_PRICING_DATA", //POST_INVENTORY_AVAILABILITY_DATA / POST_PRODUCT_PRICING_DATA
        inputFeedDocumentId: feed_upload_details.feedDocumentId,
      },
    });
    console.log(feed_creation_infos);
    res.json({ feed_upload_details, uploadRes, feed_creation_infos });
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/status", async (req, res) => {
  try {
    const status = await spClient.callAPI({
      operation: "getFeed",
      endpoint: "feeds",
      path: {
        feedId: "51191019771",
      },
    });
    res.json(status);
  } catch (error) {
    res.status(500).json(error);
  }
});

router.get("/documents", async (req, res) => {
  try {
    const status = await spClient.callAPI({
      operation: "getFeedDocument",
      endpoint: "feeds",
      path: {
        feedDocumentId: `amzn1.tortuga.4.na.54e66a87-4b80-4fc7-b650-1e55dfd7b476.T12OB3F9U7N7HM`,
      },
    });
    res.json(status);
  } catch (error) {
    res.status(500).json(error);
  }
});

// reports (skus)

router.get("/reports", async (req, res) => {
  try {
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

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

// get all products data
router.get("/reports", async (req, res) => {
  try {
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

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error });
  }
});

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

// create dropbeforewrite!!!!
router.post("/sync-items", async (req, res) => {
  try {
    const items = await readReportFile("./additional_files/amazon_report.csv");
    await processItemsInBulk(items);

    res.json({ success: true, message: "SKUs synced successfully." });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

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
    console.log(error);
  }
};

router.post("/update-items", async (req, res) => {
  try {
    let currentPage = 1;
    let totalPages = 1;

    while (currentPage <= totalPages) {
      const response = await bigCommerceInstance.get(
        `/catalog/variants?limit=250&page=${currentPage}`
      );

      const items = response.data;
      const meta = response.meta.pagination;

      await updateAmazonItems(items);

      totalPages = meta.total_pages;
      console.log("currentPage", currentPage);
      await delay(250);
      currentPage++;
    }

    console.log("updated!");

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

export { router as amazonRouter };
