import express from "express";
import axios from "axios";

import { bigCommerceInstance } from "../../instances/index.js";

const router = express.Router();

function buildTreeString(category, indent = "", prefix = "") {
  let output = indent + prefix + category.id + " " + category.name + "\n";

  if (category.children && category.children.length) {
    for (let child of category.children) {
      output += buildTreeString(child, indent + "  ", "- ");
    }
  }

  return output;
}

router.get("/test-action/", async (req, res) => {
  let treeString = "";

  try {
    const response = await bigCommerceInstance.get(
      "/catalog/trees/1/categories"
    );
    for (let category of response.data) {
      treeString += buildTreeString(category);
    }
    res.json(treeString);
  } catch (error) {
    res.status(500).json(error);
  }
});

export { router as testActionRouter };
