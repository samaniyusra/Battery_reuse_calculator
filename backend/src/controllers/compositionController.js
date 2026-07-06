import composition from "../data/batteries.json" with { type: "json" };

export const getComposition = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      data: composition,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Unable to fetch battery composition.",
      error: error.message,
    });
  }
};