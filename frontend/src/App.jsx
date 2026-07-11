import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBatteryHalf,
  FaCalculator,
  FaCoins,
  FaRecycle,
  FaChartLine,
} from "react-icons/fa";

const API = "https://battery-reuse-calculator.onrender.com/api/calculate";

export default function App() {
  const [deviceType, setDeviceType] = useState("mobile");

  // User can change either of these
  const [numberOfBatteries, setNumberOfBatteries] = useState(1);
  const [batteryWeightKg, setBatteryWeightKg] = useState(0);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const [compositionData, setCompositionData] = useState({});

  useEffect(() => {
    const fetchComposition = async () => {
      try {
        const res = await axios.get(
          "https://battery-reuse-calculator.onrender.com/api/composition"
        );

        setCompositionData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComposition();
  }, []);

  if (Object.keys(compositionData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-700">
          Loading Battery Dataset...
        </h1>
      </div>
    );
  }

  const selectedBattery = compositionData[deviceType];

  // Whenever user changes Mobile/Laptop
  useEffect(() => {
    if (selectedBattery) {
      const defaultKg =
        selectedBattery.batteryWeight / 1000;

      setBatteryWeightKg(defaultKg.toFixed(2));
      setNumberOfBatteries(1);
    }
  }, [deviceType]);

  // Recalculate API
  const recalculate = async (batteryCount) => {
    try {
      const response = await axios.post(
        `${API}/battery`,
        {
          deviceType,
          numberOfBatteries: batteryCount,
        }
      );

      setResult(response.data.data);
    } catch (err) {
      console.log(err);
    }
  };

  const calculate = async () => {
    try {
      setLoading(true);
      setResult(null);

      const response = await axios.post(
        `${API}/battery`,
        {
          deviceType,
          numberOfBatteries,
        }
      );

      setResult(response.data.data);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message ??
          "Calculation Failed."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
  <div className="min-h-screen bg-slate-100">

    {/* ================= HEADER ================= */}

    <div className="bg-gradient-to-r from-blue-700 via-blue-600 to-cyan-600 shadow-xl">

      <div className="max-w-7xl mx-auto px-8 py-8">

        <h1 className="text-4xl font-bold text-white flex items-center gap-3">
          <FaBatteryHalf />
          Battery Recovery Value Calculator
        </h1>

        <p className="text-blue-100 mt-2 text-lg">
          Estimate the recoverable value of
          Mobile Phone and Laptop Batteries
          using live market prices.
        </p>

      </div>

    </div>

    <div className="max-w-7xl mx-auto p-8">

      <div className="grid lg:grid-cols-2 gap-8">

        {/* ================= CALCULATOR ================= */}

        <div className="bg-white rounded-2xl shadow-xl p-8">

          <h2 className="text-2xl font-bold flex items-center gap-3 mb-8">

            <FaCalculator className="text-blue-600" />

            Recovery Calculator

          </h2>

          {/* Device */}

          <div className="mb-6">

            <label className="font-semibold">
              Device Type
            </label>

            <select
              value={deviceType}
              onChange={(e) =>
                setDeviceType(e.target.value)
              }
              className="w-full mt-2 border rounded-xl p-3"
            >

              <option value="mobile">
                Mobile Phone Battery
              </option>

              <option value="laptop">
                Laptop Battery
              </option>

            </select>

          </div>

          {/* Battery Information */}

          <div className="bg-blue-50 rounded-xl p-6 mb-8">

            <h3 className="font-bold text-blue-700 mb-4">
              Battery Information
            </h3>

            <div className="space-y-3">

              <p>
                <strong>Battery Type :</strong>{" "}
                {selectedBattery.name}
              </p>

              <p>
                <strong>Weight / Battery :</strong>{" "}
                {selectedBattery.batteryWeight} g
              </p>

              <p>
                <strong>Available Materials :</strong>{" "}
                {Object.keys(selectedBattery.materials).length}
              </p>

            </div>

          </div>

          <button
            onClick={() => calculate()}
            className="w-full bg-blue-600 hover:bg-blue-700 transition rounded-xl text-white font-bold p-4"
          >

            {loading
              ? "Calculating..."
              : "Calculate Recovery Value"}

          </button>

        </div>

        {/* ================= ESTIMATED RECOVERY ================= */}

        <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl shadow-xl p-8 text-white">

          <h2 className="text-2xl font-bold flex items-center gap-3">

            <FaCoins />

            Estimated Recovery

          </h2>

          <div className="mt-8 bg-white/20 rounded-2xl p-8 text-center">

            <p className="text-lg">
              Estimated Recovery Value
            </p>

            <h1 className="text-6xl font-bold my-6">

              {result
                ? `₹${result.totalRecoveredValue.toLocaleString()}`
                : "₹0.00"}

            </h1>

            <p className="text-lg">

              {result
                ? `${result.numberOfBatteries} Batteries`
                : "Click Calculate"}

            </p>

          </div>

          <div className="grid grid-cols-2 gap-4 mt-8">

            <div className="bg-white/20 rounded-xl p-5">

              <p className="text-sm opacity-80">
                Device
              </p>

              <h3 className="text-xl font-bold mt-2">
                {selectedBattery.name}
              </h3>

            </div>

            <div className="bg-white/20 rounded-xl p-5">

              <p className="text-sm opacity-80">
                Weight
              </p>

              <h3 className="text-xl font-bold mt-2">

                {result
                  ? result.totalBatteryWeightKg
                  : (
                      selectedBattery.batteryWeight /
                      1000
                    ).toFixed(2)}{" "}
                kg

              </h3>

            </div>

            <div className="bg-white/20 rounded-xl p-5">

              <p className="text-sm opacity-80">
                Materials
              </p>

              <h3 className="text-xl font-bold mt-2">

                {
                  Object.keys(
                    selectedBattery.materials
                  ).length
                }

              </h3>

            </div>

            <div className="bg-white/20 rounded-xl p-5">

              <p className="text-sm opacity-80">
                Live Prices
              </p>

              <h3 className="text-xl font-bold mt-2">
                Updated
              </h3>

            </div>

          </div>

        </div>

      </div>
            {/* ================= AFTER CALCULATION ================= */}

      {result && (

        <div className="grid lg:grid-cols-2 gap-8 mt-10">

          {/* ========================================= */}
          {/* USER INPUT (KG / BATTERIES) */}
          {/* ========================================= */}

          <div className="bg-white rounded-2xl shadow-lg p-8">

            <h2 className="text-2xl font-bold mb-6">
              Battery Quantity
            </h2>

            <p className="text-slate-600 mb-6">
              Enter either the battery weight or the
              number of batteries. The other value is
              updated automatically.
            </p>

            {/* Weight */}

            <div className="mb-6">

              <label className="font-semibold">
                Battery Weight (kg)
              </label>

              <input
                type="number"
                step="0.1"
                min="0.01"
                value={batteryWeightKg}
                onChange={(e) => {

                  const kg = Number(e.target.value);

                  setBatteryWeightKg(kg);

                  const batteries = Math.round(
                    (kg * 1000) /
                    selectedBattery.batteryWeight
                  );

                  setNumberOfBatteries(
                    batteries > 0 ? batteries : 1
                  );

                  recalculate(
                    batteries > 0 ? batteries : 1
                  );

                }}
                className="w-full mt-2 border rounded-xl p-3"
              />

            </div>

            {/* Batteries */}

            <div className="mb-6">

              <label className="font-semibold">
                Number of Batteries
              </label>

              <input
                type="number"
                min="1"
                value={numberOfBatteries}
                onChange={(e) => {

                  const batteries = Number(e.target.value);

                  setNumberOfBatteries(batteries);

                  const kg =
                    (
                      batteries *
                      selectedBattery.batteryWeight
                    ) / 1000;

                  setBatteryWeightKg(
                    kg.toFixed(2)
                  );

                  recalculate(batteries);

                }}
                className="w-full mt-2 border rounded-xl p-3"
              />

            </div>

            <div className="bg-blue-50 rounded-xl p-5">

              <p>

                <strong>Total Weight :</strong>{" "}

                {batteryWeightKg} kg

              </p>

              <p className="mt-2">

                <strong>Batteries :</strong>{" "}

                {numberOfBatteries}

              </p>

            </div>

          </div>

          {/* ========================================= */}
          {/* BATTERY COMPOSITION */}
          {/* ========================================= */}

          <div className="bg-white rounded-2xl shadow-lg p-6">

            <h2 className="text-xl font-bold mb-5">
              Battery Composition
            </h2>

            <table className="w-full text-sm">

              <thead>

                <tr className="bg-blue-600 text-white">

                  <th className="p-3 text-left">
                    Material
                  </th>

                  <th className="p-3 text-center">
                    Weight / Battery (g)
                  </th>

                </tr>

              </thead>

              <tbody>

                {Object.entries(
                  selectedBattery.materials
                ).map(([metal, info]) => {

                  const present =
                    (
                      (info.presentPerKg / 1000) *
                      selectedBattery.batteryWeight
                    ).toFixed(2);

                  return (

                    <tr
                      key={metal}
                      className="border-b hover:bg-slate-50"
                    >

                      <td className="p-3 font-medium">
                        {metal}
                      </td>

                      <td className="p-3 text-center">
                        {present} g
                      </td>

                    </tr>

                  );

                })}

              </tbody>

            </table>

          </div>

        </div>

      )}
      {/* ================= RECOVERY BREAKDOWN ================= */}

      {result && (

        <div className="bg-white rounded-2xl shadow-lg mt-10 p-8 overflow-x-auto">

          <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">

            <FaRecycle className="text-green-600" />

            Recovery Breakdown

          </h2>

          <table className="w-full">

            <thead>

              <tr className="bg-blue-600 text-white">

                <th className="p-4">
                  Material
                </th>

                <th className="p-4">
                  Recoverable Material (kg)
                </th>

                <th className="p-4">
                  Live Price (₹/kg)
                </th>

                <th className="p-4">
                  Recovery Value (₹)
                </th>

              </tr>

            </thead>

            <tbody>

              {result.breakdown.map((item) => (

                <tr
                  key={item.metal}
                  className="border-b hover:bg-slate-50"
                >

                  <td className="p-4 font-semibold">
                    {item.metal}
                  </td>

                  <td className="p-4 text-center">
                    {(item.recoveredWeight / 1000).toFixed(4)}
                  </td>

                  <td className="p-4 text-center">
                    ₹{item.marketPrice.toLocaleString()}
                  </td>

                  <td className="p-4 text-center font-bold text-green-700">
                    ₹{item.recoveredValue.toFixed(2)}
                  </td>

                </tr>

              ))}

            </tbody>

            <tfoot>

              <tr className="bg-slate-100 font-bold">

                <td className="p-4 text-right">
                  TOTAL
                </td>

                <td className="p-4 text-center">

                  {(
                    result.breakdown.reduce(
                      (sum, item) =>
                        sum + item.recoveredWeight,
                      0
                    ) / 1000
                  ).toFixed(4)}{" "}
                  kg

                </td>

                <td className="p-4 text-center">
                  —
                </td>

                <td className="p-4 text-center text-green-700 text-xl">

                  ₹
                  {result.totalRecoveredValue.toLocaleString()}

                </td>

              </tr>

            </tfoot>

          </table>

        </div>

      )}

      {/* ================= FOOTER SUMMARY ================= */}

      {result && (

        <div className="bg-gradient-to-r from-blue-700 to-cyan-600 rounded-2xl shadow-xl mt-10 p-8 text-white">

          <div className="grid md:grid-cols-4 gap-6">

            <div>

              <p className="text-blue-100">
                Device
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {result.deviceName}
              </h2>

            </div>

            <div>

              <p className="text-blue-100">
                Batteries Processed
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {result.numberOfBatteries}
              </h2>

            </div>

            <div>

              <p className="text-blue-100">
                Total Weight
              </p>

              <h2 className="text-2xl font-bold mt-2">
                {result.totalBatteryWeightKg} kg
              </h2>

            </div>

            <div>

              <p className="text-blue-100">
                Estimated Value
              </p>

              <h2 className="text-4xl font-bold text-yellow-300 mt-2">
                ₹{result.totalRecoveredValue}
              </h2>

            </div>

          </div>

        </div>

      )}

    </div>

  </div>

);

}

