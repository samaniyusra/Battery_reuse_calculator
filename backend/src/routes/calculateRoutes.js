import express from "express";

import {
  getMetalPrices,
  calculateBattery,
  calculateMaterial,
} from "../controllers/calculateController.js";

const router = express.Router();

router.get("/prices", getMetalPrices);

router.post("/battery", calculateBattery);

router.post("/material", calculateMaterial);

export default router;