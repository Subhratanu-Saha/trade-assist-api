import { Router } from "express";
import { retrieveFund } from "../controllers/fundController.js";

const router = Router();

router.get("/retrieve", retrieveFund);

export default router;