// ✅ Logout function
function logout() {
  sessionStorage.clear();
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ✅ Display welcome message
const userRole = sessionStorage.getItem("role") || "Manager";
document.getElementById("welcome").innerText = `Welcome, ${userRole}!`;

/* ---------------------- FETCH PROJECTS ---------------------- */
async function fetchDashboardData() {
  try {
    const projectsRes = await fetch("/api/data/projects");

    if (!projectsRes.ok) {
      return alert("Error loading projects.");
    }

    const projects = await projectsRes.json();
    populateTable("projectsTable", Array.isArray(projects) ? projects : []);

  } catch (err) {
    console.error("Dashboard fetch error:", err);
    alert("Error loading dashboard data.");
  }
}

/* ---------------------- FETCH EXPENSES ---------------------- */
async function loadExpenses() {
  try {
    const res = await fetch("/api/data/expenses");
    const expenses = await res.json();

    populateTable("expensesTable", Array.isArray(expenses) ? expenses : []);
  } catch (err) {
    console.error("Expense load error:", err);
    alert("Error loading expenses.");
  }
}

/* ---------------------- ADD EXPENSE ---------------------- */
async function addExpense() {
  const description = document.getElementById("expDesc").value;
  const amount = document.getElementById("expAmount").value;

  const res = await fetch("/api/data/expenses", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description, amount })
  });

  const data = await res.json();
  alert(data.message);

  loadExpenses(); // refresh table
}

/* ---------------------- POPULATE TABLE ---------------------- */
function populateTable(tableId, data) {
  const tbody = document.getElementById(tableId).querySelector("tbody");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
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

/* ---------------------- SEARCH FILTER ---------------------- */
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

/* ---------------------- INITIAL LOAD ---------------------- */
fetchDashboardData();
loadExpenses();


