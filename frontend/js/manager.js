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
    const projectsRes = await fetch("/data/projects");
    
    if (!projectsRes.ok) {
      console.error("Failed to fetch projects:", projectsRes);
      return alert("Error loading dashboard data.");
    }

    const projects = await projectsRes.json();
    
    // Ensure array
    populateTable("projectsTable", Array.isArray(projects) ? projects : []);

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

// ✅ Initial load
fetchDashboardData();

