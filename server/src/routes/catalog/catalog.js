import express, { query } from "express";
import { hhInstance, puInstance, wpsInstance } from "../../instances/index.js";
import { lsInstance } from "../../instances/ls-instance.js";
import { getInventory, getPrice } from "../../common/pu.js";
import { turnMiddleLayerModel } from "../../models/turnMiddleLayer.js";
import { readInventoryFile } from "../../ftp/index.js";
import { readLSCatalogFile } from "../../common/ls.js";

const router = express.Router();

// vendor connection point

const getWPSCatalog = async (offset = "", search = "") => {
  try {
    let catalog = {};
    let response = await wpsInstance.get(
      `/items?include=inventory,images&filter[name][pre]=${search}&page[cursor]=${offset}`
    );

    if (!response.data.data.length) {
      response = await wpsInstance.get(
        `/items?include=inventory,images&filter[sku][pre]=${search}&page[cursor]=${offset}`
      );
    }

    catalog.data = response.data.data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        url: item.product_id ? `/product/${item.product_id}?vendor=WPS` : null,
        sku: item.sku,
        image_url: item.images.data[0]
          ? `https://${item.images.data[0]?.domain}${item.images.data[0]?.path}${item.images.data[0]?.filename}`
          : "",
        price: +item.list_price,
        inventory: +item.inventory.data.total,
      };
    });
    catalog.meta = {
      current: response.data.meta.cursor.current,
      next: response.data.meta.cursor.next,
      prev: response.data.meta.cursor.prev,
      total: null,
    };
    return catalog;
  } catch (error) {
    return error.message;
  }
};

const getPUCatalog = async (offset = 0, search = "") => {
  try {
    const catalog = {};
    let payload = {
      queryString: search,
      pagination: {
        limit: 10,
        offset: offset,
      },
    };
    const response = await puInstance.post("parts/search", payload);

    catalog.data = response.data.result.hits.map((item) => {
      return {
        id: item.partNumber,
        name: item.description,
        url: `/product/${item.partNumber}?vendor=PU`,
        sku: item.partNumber,
        image_url: item.primaryMedia
          ? item.primaryMedia.absoluteUrl.replace("http:", "https:")
          : "",
        price: getPrice(item.prices),
        inventory: getInventory(item.inventory),
      };
    });
    // next/prev
    const navigation = (offset, totalProducts) => {
      let next = null;
      let prev = null;
      const pageSize = 10;

      if (offset + pageSize < totalProducts) {
        next = offset + pageSize;
      }

      if (offset >= pageSize) {
        prev = offset - pageSize;
      }

      return {
        current: offset,
        next,
        prev,
        total: totalProducts,
      };
    };

    catalog.meta = navigation(
      response.data.request.pagination.offset,
      response.data.result.total
    );

    return catalog;
  } catch (error) {
    return error.message;
  }
};

const getHHCatalog = async (offset = 0, search = "") => {
  try {
    const catalog = {};

    const response = await hhInstance.get(
      `/stage_products?query=${search}&page=${offset}`
    );
    catalog.data = response.data.hits.map((item) => {
      return {
        id: item.objectID,
        name: item.product_name,
        url: `/product/${item.objectID}?vendor=HH&link=${item.direct_link}`,
        sku: item.skus[0],
        image_url: item.list_image,
        price: item.price,
        inventory: null,
      };
    });
    const navigation = (offset, total, totalProducts) => {
      let next = null;
      let prev = null;
      if (offset < total) {
        next = offset + 1;
      }

      if (offset >= 1) {
        prev = offset - 1;
      }

      return {
        current: offset,
        next,
        prev,
        total: totalProducts,
      };
    };

    catalog.meta = navigation(
      response.data.page,
      response.data.nbPages,
      response.data.nbHits
    );
    return catalog;
  } catch (error) {
    return error.message;
  }
};

const getLSCatalog = async (offset = 0, search = "") => {
  try {
    const catalog = {};

    const items = await readLSCatalogFile();

    if (!items) {
      return { error: "Failed to read inventory file for LS" };
    }

    // Filter based on the search term
    const filteredItems = items.filter(
      (item) =>
        item["Product title"].toLowerCase().includes(search.toLowerCase()) ||
        item["Part Number"].toLowerCase().includes(search.toLowerCase())
    );

    const pageSize = 10;
    const start = offset * pageSize;
    const paginatedItems = filteredItems.slice(start, start + pageSize);

    catalog.data = paginatedItems.map((item) => {
      let image = item["Photo 1"];

      if (image && image.includes("mpgcreative")) {
        image = null;
      }

      return {
        id: item["Part Number"],
        name: item["Product title"],
        url: `/product/${item["Part Number"]}?vendor=LS`,
        sku: item["Part Number"],
        image_url: image || null,
        price: item["MRP"],
        inventory: null,
      };
    });

    const navigation = (offset, total, totalProducts) => {
      let next = null;
      let prev = null;
      if (offset < total) {
        next = offset + 1;
      }

      if (offset >= 1) {
        prev = offset - 1;
      }

      return {
        current: offset,
        next,
        prev,
        total: totalProducts,
      };
    };

    catalog.meta = navigation(
      +offset,
      Math.ceil(filteredItems.length / pageSize) - 1,
      filteredItems.length
    );

    return catalog;
  } catch (error) {
    return { error: error.message };
  }
};

const getTURNCatalog = async (offset = 0, search = "") => {
  if (!offset) offset = 1;

  try {
    const catalog = {};
    let products;

    const query = search
      ? {
          $or: [
            { name: { $regex: search, $options: "i" } },
            { sku: { $regex: search, $options: "i" } },
          ],
        }
      : {};

    const options = {
      page: offset,
      limit: 20,
      lean: true,
      leanWithId: false,
      sort: { updatedAt: -1 },
      select: "id name sku images price inventory_level", // Only fetch required fields
    };

    products = await turnMiddleLayerModel.paginate(query, options);

    catalog.data = products.docs.map((item) => ({
      id: item.id,
      name: item.name,
      url: `/product/${item.id}?vendor=TURN`,
      sku: item.sku,
      image_url: item.images[0] || null,
      price: item.price,
      inventory: item.inventory_level,
    }));

    catalog.meta = {
      current: products.page,
      next: products.nextPage,
      prev: products.prevPage,
      total: products.totalDocs,
    };

    return catalog;
  } catch (error) {
    throw error;
  }
};

export const getTORCCatalog = async (offset = 0, search = "") => {
  try {
    const catalog = {};

    const items = await readInventoryFile("TORC", "csv");

    if (!items) {
      return { error: "Failed to read inventory file for TORC" };
    }

    // Filter based on the search term
    const filteredItems = items.filter(
      (item) =>
        item["Description"].toLowerCase().includes(search.toLowerCase()) ||
        item["SKU"].toLowerCase().includes(search.toLowerCase())
    );

    const pageSize = 10;
    const start = offset * pageSize;
    const paginatedItems = filteredItems.slice(start, start + pageSize);

    catalog.data = paginatedItems.map((item) => {
      const price = parseFloat(item.Price_Retail.replace("$", ""));

      return {
        id: item["SKU"],
        name: item["Description"],
        url: `/product/${item["SKU"]}?vendor=TORC`,
        sku: item["SKU"],
        image_url: null,
        price: price,
        inventory: item["Qty Avail Now"] || null,
      };
    });

    const navigation = (offset, total, totalProducts) => {
      let next = null;
      let prev = null;
      if (offset < total) {
        next = offset + 1;
      }

      if (offset >= 1) {
        prev = offset - 1;
      }

      return {
        current: offset,
        next,
        prev,
        total: totalProducts,
      };
    };

    catalog.meta = navigation(
      +offset,
      Math.ceil(filteredItems.length / pageSize) - 1,
      filteredItems.length
    );

    return catalog;
  } catch (error) {
    sendNotification(`getTORCCatalog Error: ${error.message}`);
    return { error: error.message };
  }
};

// vendor connection point

export const getCatalog = async (vendor, offset, search) => {
  let response;
  switch (vendor) {
    case "WPS":
      response = await getWPSCatalog(offset, search);
      break;
    case "PU":
      response = await getPUCatalog(offset, search);
      break;
    case "HH":
      response = await getHHCatalog(offset, search);
      break;
    case "LS":
      response = await getLSCatalog(offset, search);
      break;
    case "TURN":
      response = await getTURNCatalog(offset, search);
      break;
    case "TORC":
      response = await getTORCCatalog(offset, search);
      break;
    default:
      response = { error: "Unsupported vendor." };
      break;
  }
  return response;
};

router.get("/products/", async (req, res) => {
  const { vendor, offset, search } = req.query;
  try {
    const response = await getCatalog(vendor, offset, search);
    if (response.error) {
      res.status(400).json(response);
    } else {
      res.json(response);
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as catalogRouter };
