import express from "express";
import { executeQuery, sql } from "../utils/db.js"; // <-- sql added
import { requireAuth } from "../middleware/authMiddleware.js";

const router = express.Router();

/* ---------------------- PROJECTS (Owner + Manager) ---------------------- */
router.get("/projects", requireAuth, async (req, res) => {
  console.log("Session user (projects):", req.session.user);

  try {
    const result = await executeQuery(`
      SELECT projectID, clientID, description, dueDate, status
      FROM Project
    `);

    res.json(result || []);
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
    
    if (role.toLowerCase() !== "owner") {
      return res.status(403).json({ message: "Access denied: Owners only" });
    }

    const projects = await executeQuery(`
      SELECT projectID, clientID, description, dueDate, status
      FROM Project
    `);

    const invoices = await executeQuery(`
      SELECT invoiceID, projectID, amount, dateIssued, paymentStatus
      FROM Invoice
    `);

    res.json({ data: { projects, invoices } });
  } catch (err) {
    console.error("Owner Dashboard Error:", err);
    res.status(500).json({ message: "Server error loading owner dashboard" });
  }
});

/* ---------------------- ACCOUNTANT DASHBOARD ---------------------- */
router.get("/accountant", requireAuth, async (req, res) => {
  console.log("Session user (accountant route):", req.session.user);
  
  try {
    const { role } = req.session.user;
    
    if (role.toLowerCase() !== "accountant") {
      return res.status(403).json({ message: "Access denied: Accountants only" });
    }

    const invoices = await executeQuery(`
      SELECT invoiceID, projectID, amount, dateIssued, paymentStatus
      FROM Invoice
    `);

    const payments = await executeQuery(`
      SELECT paymentID, invoiceID, method, totalAmount, transactionDate
      FROM Payment
    `);

    res.json({ data: { invoices, payments } });
  } catch (err) {
    console.error("Accountant Dashboard Error:", err);
    res.status(500).json({ message: "Server error loading accountant dashboard" });
  }
});

/* ---------------------- DB CHECK ---------------------- */
router.get("/db-check", async (req, res) => {
  try {
    const result = await executeQuery("SELECT DB_NAME() AS CurrentDatabase");
    res.json(result);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "DB check failed" });
  }
});

/* ---------------------- MANAGER: Add Expense ---------------------- */
router.post("/expenses", requireAuth, async (req, res) => {
  const { role, id } = req.session.user;
  
  if (role.toLowerCase() !== "manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }
  
  const { description, amount } = req.body;
  
  try {
    await executeQuery(
      `
      INSERT INTO Expense (managerID, description, amount, dateRecorded)
      VALUES (@id, @description, @amount, GETDATE())
      `,
      [
        { name: "id", type: sql.Int, value: id },
        { name: "description", type: sql.VarChar, value: description },
        { name: "amount", type: sql.Decimal(10, 2), value: amount }
      ]
    );

    res.json({ success: true, message: "Expense added successfully" });
  } catch (err) {
    console.error("Expense Insert Error:", err);
    res.status(500).json({ message: "Server error adding expense" });
  }
});

/* ---------------------- MANAGER: Get Expenses ---------------------- */
router.get("/expenses", requireAuth, async (req, res) => {
  const { role, id } = req.session.user;

  if (role.toLowerCase() !== "manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }

  try {
    const expenses = await executeQuery(
      `
      SELECT expenseID, description, amount, dateRecorded
      FROM Expense
      WHERE managerID = @id
      `,
      [{ name: "id", type: sql.Int, value: id }]
    );

    res.json(expenses || []);
  } catch (err) {
    console.error("Expense Fetch Error:", err);
    res.status(500).json({ message: "Server error loading expenses" });
  }
});

export default router;

