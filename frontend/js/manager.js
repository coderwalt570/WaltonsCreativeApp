async function logout() {
  sessionStorage.clear();
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

async function loadDashboard() {
  const resProjects = await fetch("/api/projects");
  const resExpenses = await fetch("/api/expenses");
  const resInvoices = await fetch("/api/invoices");

  const projects = await resProjects.json();
  const expenses = await resExpenses.json();
  const invoices = await resInvoices.json();

  fillTable("projectsTable", projects);
  fillTable("expensesTable", expenses);

  drawChart(expenses);
}

function fillTable(id, data) {
  const table = document.getElementById(id);
  table.innerHTML = "";
  if (!data.length) return table.innerHTML = "<tr><td>No data available</td></tr>";

  const headers = Object.keys(data[0]);
  table.innerHTML = `
    <thead><tr>${headers.map(h => `<th>${h}</th>`).join("")}</tr></thead>
    <tbody>${data.map(row => `<tr>${headers.map(h => `<td>${row[h]}</td>`).join("")}</tr>`).join("")}</tbody>
  `;
}

function drawChart(expenses) {
  const categories = {};
  expenses.forEach(e => categories[e.Category] = (categories[e.Category] || 0) + Number(e.Amount));

  new Chart(document.getElementById("expenseChart"), {
    type: "bar",
    data: {
      labels: Object.keys(categories),
      datasets: [{ data: Object.values(categories) }]
    }
  });
}

loadDashboard();

