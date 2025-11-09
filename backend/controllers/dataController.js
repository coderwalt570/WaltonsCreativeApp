import { executeQuery, sql } from "../utils/db.js";

// Returns role-specific dashboard data
export const getDashboardData = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ success: false, message: "Not logged in" });
  }

  const role = req.session.user.role;

  try {
    let query = "";

    switch (role) {
      case "Owner":
        // Example: total invoices per project
        query = `
          SELECT p.description AS Label, SUM(i.amount) AS Value
          FROM Project p
          JOIN Invoice i ON p.projectID = i.projectID
          GROUP BY p.description
        `;
        break;
  
      case "Manager":
        // Example: total expenses per category
        query = `
          SELECT category AS Label, SUM(amount) AS Value
          FROM Expense
          WHERE managerID = @managerID
          GROUP BY category
        `;
        break;
  
      case "Accountant":
        // Example: total payments per method
        query = `
          SELECT method AS Label, SUM(totalAmount) AS Value
          FROM Payment
          GROUP BY method
        `;
        break;
  
      default:
        return res.status(403).json({ success: false, message: "Unauthorized role" });
    }
  
    const params = [];
    if (role === "Manager") {
      params.push({ name: "managerID", type: sql.Int, value: req.session.user.id });
    }
  
    const data = await executeQuery(query, params);
    return res.json({ success: true, data });
  
  } catch (err) {
    console.error("Dashboard Data Error:", err);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};
