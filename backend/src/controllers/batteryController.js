import weights from "../data/batteries.json" with { type: "json" };

export const getBatteryWeights = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: weights,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch battery weights.",
      error: error.message,
    });
  }
};