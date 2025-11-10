// ✅ Load dashboard data
async function loadManagerDashboard() {
  try {
    const projectsRes = await fetch("/api/data/projects");
    const expensesRes = await fetch("/api/data/expenses");

    if (!projectsRes.ok || !expensesRes.ok) {
      throw new Error("Failed to fetch data");
    }

    const projects = await projectsRes.json();
    const expenses = await expensesRes.json();

    renderTable("projectsTable", projects);
    renderTable("expensesTable", expenses);
    drawExpenseChart(expenses);

  } catch (error) {
    console.error("Dashboard Load Error:", error);
    alert("Error loading dashboard data.");
  }
}

// ✅ Render table data
function renderTable(tableId, data) {
  const table = document.getElementById(tableId);
  table.innerHTML = "";

  if (!data.length) {
    table.innerHTML = "<tr><td>No data found</td></tr>";
    return;
  }

  // Build table headers
  const headerRow = document.createElement("tr");
  Object.keys(data[0]).forEach(key => {
    const th = document.createElement("th");
    th.innerText = key;
    headerRow.appendChild(th);
  });
  table.appendChild(headerRow);

  // Build table body
  data.forEach(item => {
    const row = document.createElement("tr");
    Object.values(item).forEach(value => {
      const td = document.createElement("td");
      td.innerText = value;
      row.appendChild(td);
    });
    table.appendChild(row);
  });
}

// ✅ Draw pie chart for expenses by category
function drawExpenseChart(expenses) {
  const ctx = document.getElementById("expenseChart").getContext("2d");

  const categoryTotals = {};
  expenses.forEach(exp => {
    categoryTotals[exp.Category] = (categoryTotals[exp.Category] || 0) + parseFloat(exp.Amount);
  });

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        data: Object.values(categoryTotals)
      }]
    }
  });
}

// ✅ Logout function
function logout() {
  sessionStorage.clear();
  window.location.href = "login.html";
}

loadManagerDashboard();


