const BASE_URL = "http://localhost:5000";

export const getPrices = async () => {
  const res = await fetch(`${BASE_URL}/api/calculate/prices`);
  return res.json();
};

export const calculateBattery = async (batteryType, batteryWeight) => {
  const res = await fetch(`${BASE_URL}/api/calculate/battery`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ batteryType, batteryWeight }),
  });

  return res.json();
};

export const calculateMaterial = async (batteryType, batteryWeight, material) => {
  const res = await fetch(`${BASE_URL}/api/calculate/material`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ batteryType, batteryWeight, material }),
  });

  return res.json();
};