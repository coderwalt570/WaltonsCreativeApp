import express from "express";
import { getDashboardData } from "../controllers/dataController.js";

const router = express.Router();

// GET /api/data
router.get("/", getDashboardData);

export default router;
