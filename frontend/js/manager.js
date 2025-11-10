// ✅ Logout function
function logout() {
  sessionStorage.clear();
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ✅ Display welcome message
const userRole = sessionStorage.getItem("role") || "Manager";
document.getElementById("welcome").innerText = `Welcome, ${userRole}!`;

// ✅ Fetch dashboard data
async function fetchDashboardData() {
  try {
    const [projectsRes, expensesRes] = await Promise.all([
      fetch("/api/data/projects", { credentials: "same-origin" }),
      fetch("/api/data/expenses", { credentials: "same-origin" })
    ]);

    if (!projectsRes.ok || !expensesRes.ok) throw new Error("Error loading dashboard data");

    const projects = await projectsRes.json();
    const expenses = await expensesRes.json();

    populateTable("projectsTable", projects);
    populateTable("expensesTable", expenses);
    drawExpenseChart(expenses);

  } catch (err) {
    console.error(err);
    alert("Error loading dashboard data.");
  }
}

// ✅ Populate table dynamically
function populateTable(tableId, data) {
  const tbody = document.getElementById(tableId).querySelector("tbody");
  tbody.innerHTML = "";

  data.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(val => {
      const td = document.createElement("td");
      td.innerText = val;
      tr.appendChild(td);
    });
    tbody.appendChild(tr);
  });
}

// ✅ Filter table
function filterTable(tableId, query) {
  const rows = document.getElementById(tableId).getElementsByTagName("tr");
  query = query.toLowerCase();

  for (let i = 1; i < rows.length; i++) {
    const cells = rows[i].getElementsByTagName("td");
    let match = false;

    for (let j = 0; j < cells.length; j++) {
      if (cells[j].innerText.toLowerCase().includes(query)) {
        match = true;
        break;
      }
    }
    rows[i].style.display = match ? "" : "none";
  }
}

// ✅ Draw expense chart
function drawExpenseChart(expenses) {
  const ctx = document.getElementById("expenseChart").getContext("2d");
  const categoryTotals = {};

  expenses.forEach(e => {
    categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount);
  });

  new Chart(ctx, {
    type: "pie",
    data: {
      labels: Object.keys(categoryTotals),
      datasets: [{
        label: "Expenses by Category",
        data: Object.values(categoryTotals),
        backgroundColor: ["#4b2b82", "#6744a3", "#b22222", "#ffa500", "#00aaff"]
      }]
    }
  });
}

// ✅ Initial load
fetchDashboardData();


