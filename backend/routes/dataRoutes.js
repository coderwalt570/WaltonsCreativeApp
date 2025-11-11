import express from "express";
import { executeQuery, sql } from "../utils/db.js";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Manager Projects
router.get("/projects", requireAuth, requireRole("Manager"), async (req, res) => {
  console.log("Session user (projects):", req.session.user);

  try {
    const managerID = req.session.user.id;

    const result = await executeQuery(
      `SELECT projectID, clientID, description, [date] AS DueDate, status
       FROM Project
       WHERE managerID = @managerID`,
      [{ name: "managerID", type: sql.Int, value: managerID }]
    );

    const projects = result.recordset || result;
    console.log("Projects fetched:", projects.length);

    res.json(projects);
  } catch (err) {
    console.error("Projects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Manager Expenses
router.get("/expenses", requireAuth, requireRole("Manager"), async (req, res) => {
  console.log("Session user (expenses):", req.session.user);

  try {
    const managerID = req.session.user.id;

    const result = await executeQuery(
      `SELECT expenseID, category, amount, [date]
       FROM Expense
       WHERE managerID = @managerID`,
      [{ name: "managerID", type: sql.Int, value: managerID }]
    );

    const expenses = result.recordset || result;
    console.log("Expenses fetched:", expenses.length);

    res.json(expenses);
  } catch (err) {
    console.error("Expenses Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
