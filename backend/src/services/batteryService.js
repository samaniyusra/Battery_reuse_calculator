import batteries from "../data/batteries.json" with { type: "json" };

export const getBatteryComposition = (batteryType) => {
  const battery = batteries[batteryType];

  if (!battery) {
    throw new Error(`Battery type '${batteryType}' not found.`);
  }

  return battery;
};

export const getAvailableBatteryTypes = () => {
  return Object.keys(batteries);
};