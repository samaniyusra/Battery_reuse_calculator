import express from "express";
import { getBatteryWeights } from "../controllers/batteryController.js";

const router = express.Router();

router.get("/", getBatteryWeights);

export default router;