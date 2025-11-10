async function loadManagerDashboard() {
  try {
    // Fetch Projects
    const projects = await fetch("/api/data/projects", { credentials: "include" })
      .then(res => res.json());

    // Fetch Expenses
    const expenses = await fetch("/api/data/expenses", { credentials: "include" })
      .then(res => res.json());

    renderProjectsTable(projects);
    renderExpensesTable(expenses);
    renderExpenseChart(expenses);

  } catch (error) {
    console.error("Dashboard Load Error:", error);
    alert("Error loading dashboard data.");
  }
}

// ✅ Render Projects Table
function renderProjectsTable(data) {
  const table = document.getElementById("projectsTable");
  if (!data.length) {
    table.innerHTML = "<tr><td>No projects assigned.</td></tr>";
    return;
  }

  table.innerHTML = `
    <tr>
      <th>Project ID</th>
      <th>Client ID</th>
      <th>Description</th>
      <th>Due Date</th>
      <th>Status</th>
    </tr>
    ${data.map(p => `
      <tr>
        <td>${p.ProjectID}</td>
        <td>${p.ClientID}</td>
        <td>${p.Description}</td>
        <td>${new Date(p.DueDate).toLocaleDateString()}</td>
        <td>${p.Status}</td>
      </tr>
    `).join("")}
  `;
}

// ✅ Render Expenses Table
function renderExpensesTable(data) {
  const table = document.getElementById("expensesTable");
  if (!data.length) {
    table.innerHTML = "<tr><td>No expense records found.</td></tr>";
    return;
  }

  table.innerHTML = `
    <tr>
      <th>Category</th>
      <th>Amount</th>
      <th>Date</th>
    </tr>
    ${data.map(e => `
      <tr>
        <td>${e.Category}</td>
        <td>$${e.Amount.toFixed(2)}</td>
        <td>${new Date(e.Date).toLocaleDateString()}</td>
      </tr>
    `).join("")}
  `;
}

// ✅ Draw Expense Chart
function renderExpenseChart(expenses) {
  if (!expenses.length) return;

  const ctx = document.getElementById("expenseChart");

  const categories = [...new Set(expenses.map(e => e.Category))];
  const totals = categories.map(cat =>
    expenses.filter(e => e.Category === cat)
      .reduce((sum, e) => sum + e.Amount, 0)
  );

  new Chart(ctx, {
    type: "bar",
    data: {
      labels: categories,
      datasets: [{
        label: "Expenses by Category",
        data: totals
      }]
    }
  });
}

// ✅ Logout
async function logout() {
  await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
  window.location.href = "/login.html";
}

// Initialize
loadManagerDashboard();

