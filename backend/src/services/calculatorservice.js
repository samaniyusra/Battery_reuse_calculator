import batteries from "../data/batteries.json" with { type: "json" };
import { getLivePrices } from "./priceEngine.js";

const RECOVERY_EFFICIENCY = 0.90;

/**
 * Returns average composition (g/kg)
 */
const getAverageComposition = (materialData) => {
  if (!materialData) return 0;

  if (materialData.avg !== undefined)
    return Number(materialData.avg);

  if (
    materialData.min !== undefined &&
    materialData.max !== undefined
  ) {
    return (
      (Number(materialData.min) +
        Number(materialData.max)) /
      2
    );
  }

  return 0;
};

/**
 * Format weight for frontend
 */
const formatWeight = (kg) => {
  if (kg >= 1)
    return {
      value: Number(kg.toFixed(4)),
      unit: "kg",
    };

  if (kg >= 0.001)
    return {
      value: Number((kg * 1000).toFixed(2)),
      unit: "g",
    };

  return {
    value: Number((kg * 1000000).toFixed(2)),
    unit: "mg",
  };
};

/**
 * ============================================
 * COMPLETE BATTERY CALCULATION
 * ============================================
 */
export const calculateBatteryValue = async (
  batteryType,
  batteryWeight
) => {
  if (!batteryType)
    throw new Error("Battery type is required.");

  if (!batteryWeight || batteryWeight <= 0)
    throw new Error(
      "Battery weight must be greater than zero."
    );

  const battery = batteries[batteryType];

  if (!battery)
    throw new Error("Invalid battery type.");

  const composition = battery.materials;

  const metals = Object.keys(composition);

  const livePrices = await getLivePrices(metals);

  let totalRecoveredValue = 0;

  const breakdown = [];

  for (const metal of metals) {
    const gramsPerKg = getAverageComposition(
      composition[metal]
    );

    if (gramsPerKg <= 0) continue;

    const materialWeight =
      (gramsPerKg * batteryWeight) / 1000;

    const recoverableWeight =
      materialWeight * RECOVERY_EFFICIENCY;

    const marketPrice =
      livePrices[metal]?.price ?? 0;

    const recoveredValue =
      recoverableWeight * marketPrice;

    totalRecoveredValue += recoveredValue;

    breakdown.push({
      metal,

      averageComposition: `${gramsPerKg} g/kg`,

      materialWeight,

      recoverableWeight,

      displayWeight: formatWeight(
        recoverableWeight
      ),

      recoveryEfficiency: "90%",

      marketPrice: Number(
        marketPrice.toFixed(2)
      ),

      recoveredValue: Number(
        recoveredValue.toFixed(2)
      ),
    });
  }

  return {
    batteryType,

    batteryName: battery.name,

    batteryWeight,

    recoveryEfficiency: "90%",

    totalRecoveredValue: Number(
      totalRecoveredValue.toFixed(2)
    ),

    breakdown,
  };
};

/**
 * ============================================
 * SINGLE MATERIAL CALCULATION
 * ============================================
 */
export const calculateMaterialValue = async (
  material,
  batteryType,
  batteryWeight
) => {
  if (!material)
    throw new Error("Material is required.");

  if (!batteryType)
    throw new Error("Battery type is required.");

  if (!batteryWeight || batteryWeight <= 0)
    throw new Error(
      "Battery weight must be greater than zero."
    );

  const battery = batteries[batteryType];

  if (!battery)
    throw new Error("Invalid battery type.");

  const materialData =
    battery.materials[material];

  if (!materialData)
    throw new Error(
      `${material} is not present in ${batteryType} battery.`
    );

  const gramsPerKg =
    getAverageComposition(materialData);

  const livePrices =
    await getLivePrices([material]);

  const marketPrice =
    livePrices[material]?.price ?? 0;

  // Material weight in kg
  const materialWeight =
    (gramsPerKg * batteryWeight) / 1000;

  // Recoverable weight
  const recoverableWeight =
    materialWeight * RECOVERY_EFFICIENCY;

  // Final recovered value
  const recoveredValue =
    recoverableWeight * marketPrice;

  return {
    batteryType,

    batteryName: battery.name,

    material,

    averageComposition: `${gramsPerKg} g/kg`,

    batteryWeight,

    materialWeight,

    recoverableWeight,

    displayWeight: formatWeight(
      recoverableWeight
    ),

    recoveryEfficiency: "90%",

    marketPrice: Number(
      marketPrice.toFixed(2)
    ),

    recoveredValue: Number(
      recoveredValue.toFixed(2)
    ),
  };
};