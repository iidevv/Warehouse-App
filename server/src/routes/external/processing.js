import express from "express";
import axios from "axios";
import { bigCommerceInstance } from "../../instances/index.js";

const router = express.Router();

router.get("/processing/", async (req, res) => {
    res.status(500).json({ message: 500 });
});

export { router as processingRouter };
