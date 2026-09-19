import express from "express";

import caseController from "../controllers/caseControllerCaseIDGenerate.js";

const router = express.Router();

router.get("/generate", caseController.generateCaseId);

export default router;