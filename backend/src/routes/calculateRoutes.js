import express from "express";

import {
  getMetalPrices,
  calculateBattery,
} from "../controllers/calculateController.js";

const router = express.Router();

router.get("/prices", getMetalPrices);

router.post("/battery", calculateBattery);

export default router;