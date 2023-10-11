import express from "express";
import axios from "axios";
import { puSearchInstance } from "../../instances/pu-search.js";
import { PuCategoryMappingModel } from "../../models/CategoryMapping.js";
import { turnSearch } from "../../instances/turn-search.js";

const router = express.Router();

// const getMappingCategories = async () => {
//   try {
//     const response = await PuCategoryMappingModel.find({
//       id: {
//         $exists: true,
//         $ne: null,
//         $ne: "",
//       },
//     });
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// const getPuItemsByCategory = async (id, ridingStyle) => {
//   const payload = {};

//   try {
//     const response = await puSearchInstance(payload);
//     return response;
//   } catch (error) {
//     throw error;
//   }
// };

// router.get("/test-action/", async (req, res) => {
//   const page = req.query.page || 1;
//   const search = req.query.search;
//   try {
//     const response = await turnSearch(page, search);
//     res.json(response);
//   } catch (error) {
//     res.status(500).json(error);
//   }
// });

export { router as testActionRouter };
