import express from "express";
import { executeQuery } from "../utils/db.js";
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------- PROJECTS (Owner + Manager) ---------------------- */
router.get("/projects", requireAuth, async (req, res) => {
  console.log("Session user (projects):", req.session.user);

  try {
    const { role } = req.session.user;

    // Both roles can see projects (you can add filters later if needed)
    const result = await executeQuery(`
      SELECT projectID, clientID, description, dueDate, status
      FROM Project
    `);

    const projects = result || [];
    res.json(projects);
  } catch (err) {
    console.error("Projects Error:", err);
    res.status(500).json({ message: "Server error loading projects" });
  }
});

/* ---------------------- OWNER DASHBOARD (Projects + Invoices) ---------------------- */
router.get("/", requireAuth, async (req, res) => {
  console.log("Session user (owner route):", req.session.user);

  try {
    const { role } = req.session.user;

    // Only Owners should access this route
    if (role.toLowerCase() !== "owner") {
      return res.status(403).json({ message: "Access denied: Owners only" });
    }

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
      projects: projectsResult || [],
      invoices: invoicesResult || []
    };

    res.json({ data });
  } catch (err) {
    console.error("Owner Dashboard Error:", err);
    res.status(500).json({ message: "Server error loading owner dashboard" });
  }
});

router.get("/db-check", async (req, res) => {
  try {
    const result = await executeQuery("SELECT DB_NAME() AS CurrentDatabase");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB check failed" });
  }
});

export default router;

