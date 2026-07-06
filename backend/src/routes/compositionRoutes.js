import express from "express";
import { getComposition } from "../controllers/compositionController.js";

const router = express.Router();

router.get("/", getComposition);

export default router;