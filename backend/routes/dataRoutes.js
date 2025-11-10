import express from "express";
import { executeQuery, sql } from "../utils/db.js";
import { requireRole } from "../middleware/authMiddleware.js";

const router = express.Router();

// ✅ Manager Projects
router.get("/projects", requireRole("manager"), async (req, res) => {
  try {
    const managerID = req.session.user.id;

    const projects = await executeQuery(
      `SELECT ProjectID, ClientID, Description, DueDate, Status
      FROM Project
      WHERE ManagerID = @managerID`,
      [{ name: "managerID", type: sql.Int, value: managerID }]
    );

    res.json(projects);
  } catch (err) {
    console.error("Projects Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// ✅ Manager Expenses
router.get("/expenses", requireRole("manager"), async (req, res) => {
  try {
    const managerID = req.session.user.id;

    const expenses = await executeQuery(
      `SELECT ExpenseID, Category, Amount, Date
      FROM Expense
      WHERE ManagerID = @managerID`,
      [{ name: "managerID", type: sql.Int, value: managerID }]
    );

    res.json(expenses);
  } catch (err) {
    console.error("Expenses Error:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;

