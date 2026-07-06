import fetchMetalPrices from "../services/metalCostScrapper.js";
import {
  calculateBatteryValue,
  calculateMaterialValue,
} from "../services/calculatorservice.js";

/**
 * GET /api/calculate/prices
 */
export const getMetalPrices = async (req, res) => {
  try {
    const prices = await fetchMetalPrices();

    return res.status(200).json({
      success: true,
      prices,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/calculate/battery
 * Body:
 * {
 *    "batteryType":"NMC",
 *    "batteryWeight":100
 * }
 */
export const calculateBattery = async (req, res) => {
  try {
    const { batteryType, batteryWeight } = req.body;

    const result = await calculateBatteryValue(
      batteryType,
      Number(batteryWeight)
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

/**
 * POST /api/calculate/material
 * Body:
 * {
 *    "material":"Lithium",
 *    "batteryType":"NMC",
 *    "batteryWeight":100
 * }
 */
export const calculateMaterial = async (req, res) => {
  try {
    const { material, batteryType, batteryWeight } = req.body;

    const result = await calculateMaterialValue(
      material,
      batteryType,
      Number(batteryWeight)
    );

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};