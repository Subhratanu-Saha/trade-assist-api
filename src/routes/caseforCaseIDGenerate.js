import express from "express";

import caseController from "../controllers/caseControllerCaseIDGenerate.js";

const router = express.Router();

router.get("/idgenerate", caseController.generateCaseId);

export default router;