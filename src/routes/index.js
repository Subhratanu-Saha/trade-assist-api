import { Router } from "express";

import userRoutes from "./users.js";
import customerRoutes from "./customer.js";
import purchaseRoutes from "./purchase.js";
import caseRoutes from "./case.js";
import caseIDRoutes from "./caseforCaseIDGenerate.js";

const router = Router();

router.use("/users", userRoutes);
router.use("/customers", customerRoutes);
router.use("/purchase", purchaseRoutes);
router.use("/cases", caseRoutes);
router.use("/cases/id", caseIDRoutes);

export default router;
