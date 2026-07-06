import { useState, useEffect } from "react";
import axios from "axios";
import {
  FaBatteryHalf,
  FaCalculator,
  FaFlask,
  FaCoins,
  FaChartLine,
  FaRecycle,
} from "react-icons/fa";

const API = "https://battery-reuse-calculator.onrender.com";

export default function App() {
  const [battery, setBattery] = useState("NMC");
  const [material, setMaterial] = useState("");
  const [mode, setMode] = useState("battery");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [compositionData, setCompositionData] = useState({});

  useEffect(() => {
    const fetchComposition = async () => {
      try {
        const res = await axios.get("https://battery-reuse-calculator.onrender.com/api/composition");

        setCompositionData(res.data.data);
      } catch (err) {
        console.error(err);
      }
    };

    fetchComposition();
  }, []);

  const calculate = async () => {
    try {
      setLoading(true);
      setResult(null);

      let response;

      if (mode === "battery") {
        response = await axios.post(`${API}/battery`, {
          batteryType: battery,
          batteryWeight: 1,
        });
      } else {
        if (!material) {
          alert("Please select a material.");
          setLoading(false);
          return;
        }

        response = await axios.post(`${API}/material`, {
          batteryType: battery,
          material,
          batteryWeight: 1,
        });
        
      }

      console.log(response.data);

      setResult(response.data.data);
      console.log(response.data.data);
    } catch (err) {
      console.error(err);

      alert(
        err.response?.data?.message || "Failed to calculate recovery value.",
      );
    } finally {
      setLoading(false);
    }
  };
  if (Object.keys(compositionData).length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <h1 className="text-3xl font-bold text-blue-600">
          Loading Battery Data...
        </h1>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-100">
      {/* Header */}

      <div className="bg-gradient-to-r from-blue-700 to-cyan-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-8 py-6">
          <h1 className="text-4xl font-bold flex items-center gap-3">
            <FaBatteryHalf />
            Battery Recovery Value Calculator
          </h1>

          <p className="text-blue-100 mt-2">
            Sustainable Battery Recycling & Metal Recovery
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-8">
        {/* Top Cards */}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator */}

          <div className="bg-white rounded-2xl shadow-lg p-8">
            <h2 className="text-2xl font-bold flex items-center gap-3 mb-6">
              <FaCalculator className="text-blue-600" />
              Calculator
            </h2>

            {/* Battery */}

            <div className="mb-5">
              <label className="font-semibold">Battery Chemistry</label>

              <select
                value={battery}
                onChange={(e) => {
                  setBattery(e.target.value);
                  setMaterial("");
                }}
                className="w-full mt-2 rounded-xl border p-3"
              >
                {Object.keys(compositionData).map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </div>

            {/* Radio */}

            <div className="mb-5">
              <label className="font-semibold">Calculation Type</label>

              <div className="flex gap-6 mt-3">
                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={mode === "battery"}
                    onChange={() => setMode("battery")}
                  />
                  Complete Battery
                </label>

                <label className="flex items-center gap-2">
                  <input
                    type="radio"
                    checked={mode === "material"}
                    onChange={() => setMode("material")}
                  />
                  Single Material
                </label>
              </div>
            </div>

            {/* Material */}

            {mode === "material" && (
              <div className="mb-5">
                <label className="font-semibold">Material</label>

                <select
                  value={material}
                  onChange={(e) => setMaterial(e.target.value)}
                  className="w-full mt-2 rounded-xl border p-3"
                >
                  <option value="">Select Material</option>

                  {Object.keys(compositionData[battery]?.materials || {}).map(
                    (item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ),
                  )}
                </select>
              </div>
            )}

            <button
              onClick={calculate}
              className="w-full bg-blue-600 hover:bg-blue-700 transition text-white rounded-xl p-4 font-bold"
            >
              {loading ? "Calculating..." : "Calculate"}
            </button>
          </div>

          {/* Formula */}

          <div className="bg-gradient-to-r from-blue-600 to-cyan-500 rounded-2xl shadow-lg p-8 text-white">
            <h2 className="text-2xl font-bold flex items-center gap-3">
              <FaFlask />
              Recovery Formula
            </h2>

            <div className="mt-8 bg-white/20 rounded-xl p-8">
              <p className="text-center text-2xl font-bold">Recovered Value</p>

              <p className="text-center text-5xl my-6">=</p>

              <p className="text-center text-xl">
                Σ ( Recoverable Weight × Recovery Efficiency × Market Price )
              </p>
            </div>

            <div className="mt-8 space-y-3">
              <p>✔ Recovery Efficiency = 90%</p>

              <p>✔ Live Market Prices</p>

              <p>✔ Battery Composition Dataset</p>

              <p>✔ Calculation Per Kg Battery</p>
            </div>
          </div>
        </div>

        {/* Composition */}

        <div className="bg-white rounded-2xl shadow-lg p-8 mt-10">
          <h2 className="text-2xl font-bold mb-6">
            Battery Composition
            <span className="text-blue-600 ml-2">
              ({compositionData[battery]?.name})
            </span>
          </h2>

          <table className="w-full">
            <thead>
              <tr className="bg-blue-600 text-white">
                <th className="p-4 text-left">Material</th>
                <th className="p-4 text-left">Composition</th>
              </tr>
            </thead>

            <tbody>
              {Object.entries(compositionData[battery]?.materials || {}).map(
                ([metal, info]) => (
                  <tr key={metal} className="border-b hover:bg-blue-50">
                    <td className="p-4 font-medium">{metal}</td>

                    <td className="p-4">
                      {info.min}–{info.max} {info.unit}
                    </td>
                  </tr>
                ),
              )}
            </tbody>
          </table>
        </div>

        {/* ===================== RESULTS ===================== */}

        {result && mode === "battery" && result.breakdown && (
          <>
            {/* Summary Cards */}
            <div className="grid md:grid-cols-4 gap-6 mt-10">
              <div className="bg-green-600 text-white rounded-2xl shadow-lg p-6">
                <p className="text-sm opacity-80">Total Recovery Value</p>
                <h2 className="text-3xl font-bold mt-2">
                  ₹{result.totalRecoveredValue}
                </h2>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-sm text-slate-500">Battery Type</p>
                <h2 className="text-3xl font-bold">{battery}</h2>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-sm text-slate-500">Recovery Efficiency</p>
                <h2 className="text-3xl font-bold">90%</h2>
              </div>

              <div className="bg-white rounded-2xl shadow-lg p-6">
                <p className="text-sm text-slate-500">Materials</p>
                <h2 className="text-3xl font-bold">
                  {result.breakdown.length}
                </h2>
              </div>
            </div>

            {/* Detailed Table */}

            <div className="bg-white rounded-2xl shadow-lg p-8 mt-10 overflow-x-auto">
              <h2 className="text-2xl font-bold mb-6">
                Detailed Recovery Calculation
              </h2>

              <table className="w-full">
                <thead>
                  <tr className="bg-blue-600 text-white">
                    <th className="p-4">Metal</th>
                    <th className="p-4">Average</th>
                    <th className="p-4">Recoverable</th>
                    <th className="p-4">Price(INR/kg)</th>
                    <th className="p-4">Recovered Value</th>
                  </tr>
                </thead>

                <tbody>
                  {result.breakdown.map((item) => (
                    <tr key={item.metal} className="border-b hover:bg-slate-50">
                      <td className="p-4">{item.metal}</td>

                      <td className="p-4">{item.averageComposition}</td>

                      <td className="p-4">{item.recoverableWeight} kg</td>

                      <td className="p-4">₹{item.marketPrice}</td>

                      <td className="p-4 font-bold text-green-600">
                        ₹{item.recoveredValue}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ================= SINGLE MATERIAL ================= */}

        {result && mode === "material" && !result.breakdown && (
          <div className="mt-10">
            <div className="bg-white rounded-2xl shadow-lg p-8">
              <h2 className="text-2xl font-bold mb-8">
                Material Recovery Result
              </h2>

              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-slate-500 text-sm">Material</p>
                  <h2 className="text-3xl font-bold mt-2">{result.material}</h2>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-slate-500 text-sm">Average Composition</p>
                  <h2 className="text-3xl font-bold mt-2">
                    {result.averageComposition}
                  </h2>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-slate-500 text-sm">Recoverable Weight</p>
                  <h2 className="text-3xl font-bold mt-2">
                    {result.recoverableWeight} kg
                  </h2>
                </div>

                <div className="bg-blue-50 rounded-xl p-6">
                  <p className="text-slate-500 text-sm">Market Price</p>
                  <h2 className="text-3xl font-bold mt-2">
                    ₹{result.marketPrice}
                  </h2>
                </div>
              </div>

              <div className="bg-gradient-to-r from-green-600 to-emerald-500 rounded-2xl mt-10 p-10 text-white text-center">
                <p className="text-xl">Estimated Recovered Value</p>

                <h1 className="text-6xl font-bold mt-4">
                  ₹{result.recoveredValue}
                </h1>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
