import express from "express";
import { hhInstance, puInstance, wpsInstance } from "../instances/index.js";
import { getInventory, getPrice } from "../common/pu.js";

const router = express.Router();

const getWPSCatalog = async (offset = "", search = "", searchBy = "name") => {
  try {
    const catalog = {};
    const response = await wpsInstance.get(
      `/items?include=inventory,images&filter[${searchBy}][pre]=${search}&page[cursor]=${offset}`
    );
    catalog.data = response.data.data.map((item) => {
      return {
        id: item.id,
        name: item.name,
        url: `/product/${item.id}?vendor="WPS"`,
        sku: item.sku,
        image_url: item.images.data[0]
          ? `https://${item.images.data[0]?.domain}${item.images.data[0]?.path}${item.images.data[0]?.filename}`
          : "",
        price: +item.list_price,
        iventory: +item.inventory.data.total,
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
    const response = await puInstance.post("parts/search/", payload);

    catalog.data = response.data.result.hits.map((item) => {
      return {
        id: item.partNumber,
        name: item.description,
        url: `/product/${item.partNumber}?vendor="PU"`,
        sku: item.partNumber,
        image_url: item.primaryMedia
          ? item.primaryMedia.absoluteUrl.replace("http:", "https:")
          : "",
        price: getPrice(item.prices),
        iventory: getInventory(item.inventory),
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
    const response = await hhInstance.get(
      `/stage_products?query=${search}&page=${offset}`
    );
    return response.data;
    // return catalog;
  } catch (error) {
    return error.message;
  }
};

const getCatalog = async (vendor, offset, search, searchBy) => {
  let response;
  switch (vendor) {
    case "WPS":
      response = await getWPSCatalog(offset, search, searchBy);
      break;
    case "PU":
      response = await getPUCatalog(offset, search);
      break;
    case "HH":
      response = await getHHCatalog(offset, search);
      break;
    default:
      response = { error: "Unsupported vendor." };
      break;
  }
  return response;
};

router.get("/products/", async (req, res) => {
  const vendor = req.query.vendor;
  const offset = req.query.offset;
  const searchBy = req.query.searchby;
  const search = req.query.search;

  try {
    const response = await getCatalog(vendor, offset, search, searchBy);
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
