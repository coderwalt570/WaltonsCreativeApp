import express from "express";
import { requireAuth, requireRole } from "../middleware/authMiddleware.js";
import { createInvoice, getInvoices, approveInvoice } from "../controllers/invoiceController.js";

const router = express.Router();

// All routes require authentication
router.use(verifyToken);

// Invoice CRUD
router.post("/", createInvoice);    // Create invoice (Owner/Manager)
router.get("/", getInvoices);       // View all invoices

// Manager Approval
router.put("/approve", approveInvoice); // Update paymentStatus ('Approved'/'Rejected')

export default router;
