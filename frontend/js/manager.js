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
      fetch("/api/data/projects"),
      fetch("/api/data/expenses")
    ]);

    if (!projectsRes.ok || !expensesRes.ok) {
      console.error("Failed to fetch data:", projectsRes, expensesRes);
      return alert("Error loading dashboard data.");
    }
    
    const projects = await projectsRes.json();
    const expenses = await expensesRes.json();
    
    // Ensure arrays
    populateTable("projectsTable", Array.isArray(projects) ? projects : []);
    populateTable("expensesTable", Array.isArray(expenses) ? expenses : []);

    drawExpenseChart(expenses);

  } catch (err) {
    console.error("Dashboard fetch error:", err);
    alert("Error loading dashboard data.");
  }
}

// ✅ Populate table dynamically
function populateTable(tableId, data) {
  const tbody = document.getElementById(tableId).querySelector("tbody");
  tbody.innerHTML = "";

  if (!data || !Array.isArray(data) || data.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = document.getElementById(tableId).querySelectorAll("th").length;
    td.innerText = "No data available";
    td.style.textAlign = "center";
    tr.appendChild(td);
    tbody.appendChild(tr);
    return;
  }

  data.forEach(row => {
    const tr = document.createElement("tr");
    Object.values(row).forEach(val => {
      const td = document.createElement("td");
      td.innerText = val ?? "";
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

  if (Array.isArray(expenses)) {
    expenses.forEach(e => {
      categoryTotals[e.category] = (categoryTotals[e.category] || 0) + parseFloat(e.amount || 0);
    });
  }

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


