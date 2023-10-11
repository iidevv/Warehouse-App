import express from "express";
import { hhInstance, puInstance, wpsInstance } from "../../instances/index.js";
import { lsInstance } from "../../instances/ls-instance.js";
import { getInventory, getPrice } from "../../common/pu.js";
import { turnSearch } from "../../instances/turn-search.js";

const router = express.Router();

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
    const response = await puInstance.post("parts/search/", payload);

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
    if (!offset) offset = 0;
    const response = await lsInstance.post(`/products/query`, {
      query: {
        filter: `{"name": {"$contains": "${search}"}}`,
        paging: {
          limit: 10,
          offset: offset,
        },
      },
    });
    catalog.data = response.data.products.map((item) => {
      return {
        id: item.id,
        name: item.name,
        url: `/product/${item.id}?vendor=LS`,
        sku: null,
        image_url: item.media.mainMedia.thumbnail.url,
        price: null,
        inventory: null,
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
      response.data.metadata.offset,
      response.data.totalResults
    );
    return catalog;
  } catch (error) {
    return error.message;
  }
};

const getTURNCatalog = async (offset = 0, search = "") => {
  return turnSearch(offset, search);
};

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
