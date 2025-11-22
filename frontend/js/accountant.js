// ✅ Logout
function logout() {
  sessionStorage.clear();
  localStorage.removeItem("token");
  window.location.href = "login.html";
}

// ✅ Welcome message
document.getElementById("welcome").innerText = `Welcome, Accountant`;

// ✅ Fetch accountant data (invoices + payments)
async function fetchAccountantData() {
  try {
    const res = await fetch("/api/data/accountant");

    if (!res.ok) {
      console.error("Server returned:", res.status, res.statusText);
      throw new Error("Failed to load accountant dashboard data.");
    }

    const { data } = await res.json();

    populateTable("invoicesTable", Array.isArray(data.invoices) ? data.invoices : []);
    populateTable("paymentsTable", Array.isArray(data.payments) ? data.payments : []);

  } catch (err) {
    console.error("Accountant dashboard load error:", err);
    alert("Error loading dashboard data.");
  }
}

// ✅ Populate table dynamically
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

// ✅ Table Filter
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
fetchAccountantData();


loadAccountantData();
