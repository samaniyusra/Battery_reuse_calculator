import axios from "axios";
import * as cheerio from "cheerio";

const URL = "https://metalscost.com";

export const fetchAllMetalPrices = async () => {

    const { data } = await axios.get(URL, {
        headers: {
            "User-Agent":
                "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/138 Safari/537.36"
        }
    });

    const $ = cheerio.load(data);

    const prices = {};

    $(".ticker-item").each((_, element) => {

        const name = $(element)
            .find(".ticker-name")
            .text()
            .trim();

        let price = $(element)
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

        price = Number(
            price
                .replace("₹", "")
                .replace(/,/g, "")
        );

        prices[name] = {
            metal: name,
            price,
            currency: "INR",
            unit
        };

    });

    return prices;

};