// Logout
function logout() {
  sessionStorage.clear();
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// Welcome message
document.getElementById("welcome").innerText = `Welcome, Owner`;

// Fetch dashboard data
async function fetchOwnerData() {
  try {
    // ✅ Fetch all projects
    const projectsRes = await fetch("/api/data/projects");
    // ✅ Fetch all invoices
    const invoicesRes = await fetch("/api/invoices");
    
    if (!projectsRes.ok || !invoicesRes.ok) {
    throw new Error("Server returned an error");
    }
    
    const projects = await projectsRes.json();
    const invoices = await invoicesRes.json();
    
    populateTable("projectsTable", Array.isArray(projects) ? projects : []);
    populateTable("invoicesTable", Array.isArray(invoices) ? invoices : []);

  } catch (err) {
  console.error("Owner dashboard load error:", err);
  alert("Error loading dashboard data.");
  }
}

// Populate table
function populateTable(tableId, data) {
  const tbody = document.getElementById(tableId).querySelector("tbody");
  tbody.innerHTML = "";

  if (!data || data.length === 0) {
    const tr = document.createElement("tr");
    const td = document.createElement("td");
    td.colSpan = document.getElementById(tableId).querySelectorAll("th").length;
    td.style.textAlign = "center";
    td.innerText = "No data available";
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

// Filter
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

// Initial load
fetchOwnerData();
