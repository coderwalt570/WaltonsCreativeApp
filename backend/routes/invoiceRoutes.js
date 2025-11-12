import express from "express";
import { requireAuth } from "../middleware/authMiddleware.js";
import { executeQuery, sql } from "../utils/db.js";

const router = express.Router();

// Get invoices (Owner sees all, Manager sees by project association)
router.get("/", requireAuth, async (req, res) => {
  try {
    const { role } = req.session.user;

    let invoicesResult;
    
    if (role.toLowerCase() === "owner") {
      // Owner sees ALL invoices
      invoicesResult = await executeQuery(`
        SELECT invoiceID, projectID, amount, dateIssued, paymentStatus
        FROM Invoice
      `);
    } else if (role.toLowerCase() === "manager") {
      invoicesResult = await executeQuery(`
        SELECT invoiceID, projectID, amount, dateIssued, paymentStatus
        FROM Invoice
      `);
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }

    const invoices = invoicesResult.recordset || [];
    res.json(invoices);

  } catch (error) {
    console.error("Invoice Fetch Error:", error);
    res.status(500).json({ message: "Server error fetching invoices" });
  }
});

export default router;

