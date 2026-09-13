const express = require("express");
const { generateCaseId } = require("../controllers/caseControllerCaseIDGenerate");

const router = express.Router();

router.get("/generate", generateCaseId);

module.exports = router;