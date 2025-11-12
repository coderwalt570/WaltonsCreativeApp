import express from "express";
import { executeQuery, sql } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------- MANAGER PROJECTS ---------------------- */
router.get("/projects", requireAuth, requireRole("Manager"), async (req, res) => {
  console.log("Session user (projects):", req.session.user);

  try {
    const result = await executeQuery(`
      SELECT projectID, clientID, description, dueDate, status
      FROM Project
    `);

    const projects = result.recordset || [];
    res.json(projects);
  } catch (err) {
    console.error("Projects Error:", err);
    res.status(500).json({ message: "Server error loading projects" });
  }
});

/* ---------------------- OWNER DASHBOARD ---------------------- */
router.get("/", requireAuth, requireRole("Owner"), async (req, res) => {
  console.log("Session user (owner):", req.session.user);

  try {
    // Fetch Projects
    const projectsResult = await executeQuery(`
      SELECT projectID, clientID, description, dueDate, status
      FROM Project
    `);

    // Fetch Invoices
    const invoicesResult = await executeQuery(`
      SELECT invoiceID, projectID, amount, dateIssued, paymentStatus
      FROM Invoice
    `);

    const data = {
      projects: projectsResult.recordset || [],
      invoices: invoicesResult.recordset || []
    };

    res.json({ data });
  } catch (err) {
    console.error("Owner Dashboard Error:", err);
    res.status(500).json({ message: "Server error loading owner dashboard" });
  }
});

export default router;
