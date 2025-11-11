import express from "express";
import { executeQuery, sql } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

//  Manager Projects
router.get("/projects", requireAuth, requireRole("Manager"), async (req, res) => {
  console.log("Session user (projects):", req.session.user);

  try {
    const result = await executeQuery(
      `SELECT projectID, clientID, description, dueDate, status
      FROM Project`
    );

    const projects = result.recordset || result;
    res.json(projects);

  } catch (err) {
    console.error("Projects Error:", err);
    res.status(500).json({ message: "Server error loading projects" });
  }
});

export default router;
