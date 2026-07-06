import axios from "axios";
import * as cheerio from "cheerio";

const URL = "https://metalscost.com";

export const getAllMetalPrices = async () => {

    const { data } = await axios.get(URL, {
        headers: {
            "User-Agent": "Mozilla/5.0"
        }
    });

    const $ = cheerio.load(data);

    const prices = {};

    $(".ticker-item").each((i, el) => {

        const name = $(el)
            .find(".ticker-name")
            .text()
            .trim();

        let priceText = $(el)
            .find(".ticker-price")
            .clone()
            .children()
            .remove()
            .end()
            .text()
            .trim();

        const unit = $(el)
            .find(".ticker-price small")
            .text()
            .replace("/", "")
            .trim();

        priceText = priceText
            .replace("₹", "")
            .replace(/,/g, "")
            .trim();

        prices[name] = {
            metal: name,
            price: Number(priceText),
            currency: "INR",
            unit
        };

    });

    return prices;

};