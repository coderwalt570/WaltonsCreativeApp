import { executeQuery, sql } from "../utils/db.js";

// GET dashboard data based on user role
export const getDashboardData = async (req, res) => {
  if (!req.session.user) {
    return res.status(401).json({ message: "Not logged in" });
  }

  const role = req.session.user.role;
  const userId = req.session.user.id;

  try {
    let data = {};

    if (role === "Owner") {
      // Example: show all invoices, projects, clients
      data.invoices = await executeQuery("SELECT * FROM Invoice");
      data.projects = await executeQuery("SELECT * FROM Project");
      data.clients = await executeQuery("SELECT * FROM Client");
    }

    if (role === "Manager") {
      // Example: show only expenses and projects assigned to manager
      data.expenses = await executeQuery(
        "SELECT * FROM Expense WHERE managerID = @userId",
        [{ name: "userId", type: sql.Int, value: userId }]
      );
      data.projects = await executeQuery(
        "SELECT * FROM Project WHERE ProjectID IN (SELECT ProjectID FROM Invoice)"
      );
    }

    if (role === "Accountant") {
      // Example: show all payments and invoices
      data.payments = await executeQuery("SELECT * FROM Payment");
      data.invoices = await executeQuery("SELECT * FROM Invoice");
    }

    res.json({ role, data });
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
