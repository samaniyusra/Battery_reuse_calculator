import express from "express";
import cors from "cors";
import dotenv from "dotenv";

import calculateRoutes from "./routes/calculateRoutes.js";
import compositionRoutes from "./routes/compositionRoutes.js";
import batteryRoutes from "./routes/batteyRoutes.js";


dotenv.config();

const app = express();
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://battery-reuse-calculator-jmg6jedhz-samani-yusrahs-projects.vercel.app/"
    ]
}));
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        success: true,
        message: "Battery Recovery Value Engine API"
    });
});

app.use("/api/calculate", calculateRoutes);
app.use("/api/composition", compositionRoutes);
app.use("/api/battery-data", batteryRoutes);
export default app;