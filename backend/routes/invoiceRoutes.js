import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { executeQuery, sql } from "../utils/db.js";

const router = express.Router();

// ✅ Get invoices
router.get("/", requireAuth, async (req, res) => {
  try {
    const { role, id } = req.session.user;

    let invoices;

    if (role.toLowerCase() === "owner") {
      // Owner sees ALL invoices
      invoices = await executeQuery(`SELECT * FROM Invoice`);
    } else if (role.toLowerCase() === "manager") {
      // Manager sees invoices only for projects they manage
      invoices = await executeQuery(
        `SELECT Invoice.*
         FROM Invoice
         INNER JOIN Project ON Invoice.ProjectID = Project.ProjectID
         WHERE Project.ManagerID = @managerID`,
        [{ name: "managerID", type: sql.Int, value: id }]
      );
    } else {
      return res.status(403).json({ message: "Access Denied" });
    }

    res.json(invoices);

  } catch (error) {
    console.error("Invoice Fetch Error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
