import express from "express";
import axios from "axios";
import { bigCommerceInstance } from "../../instances/index.js";

const router = express.Router();

router.get("/availability/", async (req, res) => {
    let body = req.body;
    res.status(500).json({ message: body });
});

export { router as ProductAvailabilityRouter };
