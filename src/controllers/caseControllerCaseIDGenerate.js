import caseService from "../services/caseServiceCaseIDGenerate.js";

const generateCaseId = async (req, res) => {
  try {
    const caseId = await caseService.generateCaseId();

    res.status(201).json({
      success: true,
      caseId,
    });
  } catch (error) {
    console.error("Error generating case ID:", error);

    res.status(500).json({
      success: false,
      message: "Failed to generate case ID",
    });
  }
};