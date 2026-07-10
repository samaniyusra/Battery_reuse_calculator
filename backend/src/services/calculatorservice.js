import batteries from "../data/batteries.json" with { type: "json" };
import { getLivePrices } from "./priceEngine.js";

/**
 * Calculate complete recovery for a device
 */
export const calculateBatteryValue = async (
  deviceType,
  numberOfBatteries
) => {
  if (!deviceType)
    throw new Error("Device type is required.");

  if (!numberOfBatteries || numberOfBatteries <= 0)
    throw new Error(
      "Number of batteries must be greater than zero."
    );

  const device = batteries[deviceType];

  if (!device)
    throw new Error("Invalid device type.");

  // Weight of one battery in grams
  const batteryWeight = device.batteryWeight;

  // Total battery weight in grams
  const totalBatteryWeight =
    batteryWeight * numberOfBatteries;

  // Convert grams → kg
  const totalBatteryWeightKg =
    totalBatteryWeight / 1000;

  const materials = device.materials;

  const metalNames = Object.keys(materials);

  // Fetch live prices
  const livePrices =
    await getLivePrices(metalNames);

  let totalRecoveredValue = 0;

  const breakdown = [];

  for (const metal of metalNames) {
    const presentPerKg =
      materials[metal].presentPerKg;

    const recoveredPerKg =
      materials[metal].recoveredPerKg;

    // Material present (grams)
    const presentWeight =
      presentPerKg * totalBatteryWeightKg;

    // Material recovered (grams)
    const recoveredWeight =
      recoveredPerKg *
      totalBatteryWeightKg;

    // Convert recovered grams → kg
    const recoveredWeightKg =
      recoveredWeight / 1000;

    const marketPrice =
      livePrices[metal]?.price ?? 0;

    const recoveredValue =
      recoveredWeightKg *
      marketPrice;

    totalRecoveredValue +=
      recoveredValue;

    breakdown.push({
      metal,

      presentPerKg,

      recoveredPerKg,

      presentWeight: Number(
        presentWeight.toFixed(2)
      ),

      recoveredWeight: Number(
        recoveredWeight.toFixed(2)
      ),

      marketPrice: Number(
        marketPrice.toFixed(2)
      ),

      recoveredValue: Number(
        recoveredValue.toFixed(2)
      ),

      priceSource:
        livePrices[metal]?.source ??
        "N/A",
    });
  }

  return {
    deviceType,

    deviceName: device.name,

    batteryWeight,

    numberOfBatteries,

    totalBatteryWeight,

    totalBatteryWeightKg: Number(
      totalBatteryWeightKg.toFixed(3)
    ),

    totalRecoveredValue: Number(
      totalRecoveredValue.toFixed(2)
    ),

    breakdown,
  };
};