import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { createInvoice, getInvoices, approveInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

// All invoice routes require login
router.use(requireAuth);

// Create invoice (Owner or Manager)
router.post("/", requireRole("Owner", "Manager"), createInvoice);

// View invoices
// - Owners see all invoices
// - Managers only see invoices related to their projects
router.get("/", getInvoices);

// Managers approve invoices (Owner may optionally approve too)
router.put("/approve", requireRole("Manager", "Owner"), approveInvoice);

export default router;
