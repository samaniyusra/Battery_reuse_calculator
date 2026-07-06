import axios from "axios";
import * as cheerio from "cheerio";

const URL = "https://metalscost.com/";

const fetchMetalPrices = async () => {
  try {
    const { data } = await axios.get(URL, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138.0.0.0 Safari/537.36",
      },
    });

    const $ = cheerio.load(data);

    const prices = {};

    $(".ticker-item").each((_, element) => {
      const metal = $(element).find(".ticker-name").text().trim();

      const priceText = $(element)
        .find(".ticker-price")
        .clone()
        .children()
        .remove()
        .end()
        .text()
        .trim();

      const unit = $(element)
        .find("small")
        .text()
        .replace("/", "")
        .trim();

      const price = Number(
        priceText.replace("₹", "").replace(/,/g, "")
      );

      if (!metal || Number.isNaN(price)) return;

      // Skip duplicate ticker entries
      if (prices[metal]) return;

      prices[metal] = {
        metal,
        price,
        currency: "INR",
        unit,
        source: "MetalsCost",
        updatedAt: new Date().toISOString(),
      };
    });

    return prices;
  } catch (error) {
    console.error("MetalsCost Scraper Error:", error.message);
    return {};
  }
};

export default fetchMetalPrices;