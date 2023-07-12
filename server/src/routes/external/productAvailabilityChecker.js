import express from "express";
import axios from "axios";
import { bigCommerceInstance } from "../../instances/index.js";

const router = express.Router();

router.post("/availability/", async (req, res) => {
    let body = req.body;
    console.log(body);
    res.json({ message: body });
});

export { router as ProductAvailabilityRouter };
