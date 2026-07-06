import axios from "axios";
import { metricTonToKg } from "../utils/converter.js";
import { METALS } from "../config/metal.js"

const BASE_URL = "https://api.metals.dev/v1";

export const getMetalPrice = async (metalName) => {

    const apiMetal = METALS[metalName]?.apiName;

    if (!apiMetal) {
        throw new Error(`Metal '${metalName}' is not supported.`);
    }

    try {

        const response = await axios.get(
            `${BASE_URL}/metal/spot`,
            {
                params: {
                    api_key: process.env.METALS_DEV_API_KEY,
                    metal: apiMetal,
                    currency: "INR"
                }
            }
        );

        const data = response.data;
        console.log({
            url: `${BASE_URL}/metal/spot`,
            api_key: process.env.METALS_DEV_API_KEY?.slice(0, 8),
            metal: apiMetal,
            currency: "INR"
        });

        return {
            metal: metalName,
            price: metricTonToKg(data.rate.price),
            currency: data.currency,
            unit: "kg",
            updatedAt: data.timestamp,
            source: "Metals.dev"
        };


    } catch (error) {

        console.error("--------------------------------");
        console.error("Metals.dev Error");
        console.error(error.response?.data || error.message);
        console.error("--------------------------------");

        throw new Error(`Unable to fetch ${metalName} price`);

    }

};