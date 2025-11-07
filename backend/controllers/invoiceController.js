import { executeQuery } from "../utils/db.js";
import sql from "mssql/msnodesqlv8.js";

// Create Invoice (Owner or Manager)
export const createInvoice = async (req, res) => {
  const { projectId, amount, dateIssued } = req.body;
  const userRole = req.user.role;

  if (!["Owner", "Manager"].includes(userRole)) {
    return res.status(403).json({ message: "Access denied" });
  }

  try {
    const query = `
      INSERT INTO Invoice (projectID, amount, dateIssued, paymentStatus)
      VALUES (@projectId, @amount, @dateIssued, 'Pending')
    `;
    await executeQuery(query, [
      { name: "projectId", type: sql.Int, value: projectId },
      { name: "amount", type: sql.Decimal(10, 2), value: amount },
      { name: "dateIssued", type: sql.Date, value: dateIssued }
    ]);

    res.json({ message: "Invoice created successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get all invoices (any authenticated user)
export const getInvoices = async (req, res) => {
  try {
    const query = "SELECT * FROM Invoice";
    const invoices = await executeQuery(query);
    res.json(invoices);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};

// Manager Approval (Update paymentStatus)
export const approveInvoice = async (req, res) => {
  const { invoiceID, status } = req.body; // status = 'Approved' or 'Rejected'
  const userRole = req.user.role;

  if (userRole !== "Manager") {
    return res.status(403).json({ message: "Access denied" });
  }

  if (!["Approved", "Rejected"].includes(status)) {
    return res.status(400).json({ message: "Invalid status" });
  }

  try {
    const query = `
      UPDATE Invoice
      SET paymentStatus = @status
      WHERE invoiceID = @invoiceID
    `;
    await executeQuery(query, [
      { name: "status", type: sql.NVarChar, value: status },
      { name: "invoiceID", type: sql.Int, value: invoiceID }
    ]);

    // Optional: Log action to AuditLog table
    const auditQuery = `
      INSERT INTO AuditLog (ActionType, TableName, RecordID, PerformedBy, ActionDate)
      VALUES (@actionType, 'Invoice', @recordID, @performedBy, GETDATE())
    `;
    await executeQuery(auditQuery, [
      { name: "actionType", type: sql.NVarChar, value: `Invoice ${status}` },
      { name: "recordID", type: sql.Int, value: invoiceID },
      { name: "performedBy", type: sql.NVarChar, value: req.user.username }
    ]);

    res.json({ message: `Invoice ${status.toLowerCase()} successfully` });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
