import fetchMetalPrices from "./metalCostScrapper.js";

export const getLivePrices = async (metals) => {
  const scrapedPrices = await fetchMetalPrices();

  const prices = {};

  for (const metal of metals) {
    const key = Object.keys(scrapedPrices).find(
      (m) => m.toLowerCase() === metal.toLowerCase()
    );

    if (!key) {
      // Graphite benchmark
      if (metal.toLowerCase() === "graphite") {
        prices[metal] = {
          price: 700, // ₹/kg (recycled graphite)
          currency: "INR",
          unit: "kg",
          source: "Battery Material Benchmark",
          updatedAt: new Date().toISOString(),
        };
        continue;
      }

      // Electrolytic Manganese Metal (EMM)
      if (metal.toLowerCase() === "manganese") {
        prices[metal] = {
          price: 240, // ₹/kg
          currency: "INR",
          unit: "kg",
          source: "Industrial Metal Benchmark",
          updatedAt: new Date().toISOString(),
        };
        continue;
      }

      prices[metal] = {
        error: true,
      };
      continue;
    }

    prices[metal] = {
      price: scrapedPrices[key].price,
      currency: scrapedPrices[key].currency,
      unit: scrapedPrices[key].unit,
      source: scrapedPrices[key].source,
      updatedAt: scrapedPrices[key].updatedAt,
    };
  }

  return prices;
};