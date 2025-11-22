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

// =============================
// Accountant Dashboard Route
// =============================
router.get("/accountant", requireAuth, async (req, res) => {
  console.log("Session user (accountant route):", req.session.user);

  try {
    const { role } = req.session.user;

    if (role.toLowerCase() !== "accountant") {
      return res.status(403).json({ message: "Access denied: Accountants only" });
    }

    // Fetch invoices
    const invoices = await executeQuery(`
      SELECT invoiceID, projectID, amount, dateIssued, paymentStatus
      FROM Invoice
    `);

    // Fetch payments
    const payments = await executeQuery(`
      SELECT paymentID, invoiceID, method, totalAmount, transactionDate
      FROM Payment
    `);

    res.json({
      data: {
        invoices: invoices || [],
        payments: payments || []
      }
    });

  } catch (err) {
    console.error("Accountant Dashboard Error:", err);
    res.status(500).json({ message: "Server error loading accountant dashboard" });
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

// =============================
// Add New Expense (Manager only)
// =============================
router.post("/expenses", requireAuth, async (req, res) => {
  const { role, id } = req.session.user;

  if (role.toLowerCase() !== "manager") {
    return res.status(403).json({ message: "Access denied: Managers only" });
  }

  const { description, amount } = req.body;

  try {
    await executeQuery(`
      INSERT INTO Expense (managerID, description, amount, dateRecorded)
      VALUES (@id, @description, @amount, GETDATE())
    `, [
      { name: "id", type: sql.Int, value: id },
      { name: "description", type: sql.VarChar, value: description },
      { name: "amount", type: sql.Decimal, value: amount }
    ]);

    res.json({ success: true, message: "Expense added successfully" });
  } catch (err) {
    console.error("Expense Insert Error:", err);
    res.status(500).json({ message: "Server error adding expense" });
  }
});

export default router;

