import express from "express";
import { JSDOM } from "jsdom";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PuCategoryMappingModel } from "../models/CategoryMapping.js";

const router = express.Router();

const parseHtmlContent = () => {
  const dirname = path.dirname(fileURLToPath(import.meta.url));
  const filePath = path.join(
    dirname,
    "../../additional_files/pu-categories.html"
  );
  const htmlContent = fs.readFileSync(filePath, "utf-8");

  const dom = new JSDOM(htmlContent);
  let links = dom.window.document.querySelectorAll("a.category-link");
  links = Array.from(links).map((link) => {
    return {
      id: link.href.split("/").pop(),
      name: link.textContent.trim().replace(/\s+/g, " "),
      url: `https://www.parts-unlimited.com${link.href}`,
    };
  });

  return { links };
};

const createVendorMap = async (items) => {
  try {
    await Promise.all(
      response.links.map(async (link) => {
        try {
          const item = await PuCategoryMappingModel.findOne({
            vendor_id: link.id,
          });
          if (item) return;
          await PuCategoryMappingModel.create({
            vendor_id: link.id,
            vendor_name: link.name,
            vendor_url: link.url,
          });
        } catch (innerError) {
          if (innerError.code === 11000) {
            // Check for duplicate key error
            console.warn(
              `Duplicate entry for vendor_name: ${link.name}. Skipping.`
            );
          } else {
            console.error(
              `Error processing link ${link.name}: ${innerError.message}`
            );
          }
        }
      })
    );
  } catch (error) {
    throw error;
  }
};

const getCategoryMappingModel = (vendor) => {
  let model;
  switch (vendor) {
    case "PU":
      model = PuCategoryMappingModel;
      break;

    default:
      break;
  }
  return model;
};

export const getCategories = async (vendor, query = {}, page = 1) => {
  const Model = getCategoryMappingModel(vendor);
  const options = {
    page: page,
    limit: 20,
    lean: true,
    leanWithId: false,
  };

  if (query.vendor_name) {
    const matches = query.vendor_name.match(/^\/(.*?)\/([gimsuy]*)$/);
    if (matches) {
      const [, pattern, flags] = matches;
      query.vendor_name = new RegExp(pattern, flags);
    }
  }
  const categories = await Model.paginate(query, options);

  return {
    categories: categories.docs,
    pagination: {
      page: categories.page,
      nextPage: categories.nextPage,
      prevPage: categories.prevPage,
      totalPages: categories.totalPages,
    },
    total: categories.totalDocs,
    query,
  };
};

router.get("/mapping", async (req, res) => {
  const { vendor, query, page } = req.query;
  try {
    const categories = await getCategories(vendor, query, page);
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/mapping", async (req, res) => {
  const { vendor, data } = req.body;
  const { vendor_id, id, name, url } = data;
  try {
    const Model = getCategoryMappingModel(vendor);
    const response = await Model.findOneAndUpdate(
      {
        vendor_id,
      },
      {
        id,
        name,
        url,
      },
      {
        new: true,
      }
    );
    res.json(response);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export { router as categoryMapRouter };
