// --- LOGIN FEATURE ---
document.getElementById('loginBtn')?.addEventListener('click', function() {
alert('Login feature coming soon!');
});

// --- CLIENT VIEW ---
function viewInvoices() {
document.getElementById("invoiceList").innerHTML = "<p>Loading invoices...</p>";

// Fetch invoices from backend API
fetch("/invoices")
.then(res => res.json())
.then(data => {
if (data.length === 0) {
document.getElementById("invoiceList").innerHTML = "<p>No invoices found.</p>";
} else {
const list = data.map(inv => `
<p>Invoice #${inv.invoiceID} - $${inv.amount} - ${inv.paymentStatus}</p>
`).join('');
document.getElementById("invoiceList").innerHTML = list;
}
})
.catch(err => {
console.error(err);
document.getElementById("invoiceList").innerHTML = "<p>Error loading invoices.</p>";
});
}

// --- ADMIN DASHBOARD: LOAD INVOICES ---
function loadInvoices() {
document.getElementById("adminData").innerHTML = "<p>Loading all invoices...</p>";

fetch("/invoices")
.then(res => res.json())
.then(data => {
const table = `
<table border="1" style="margin:auto;">
<tr><th>Invoice ID</th><th>Amount</th><th>Status</th></tr>
${data.map(i => `
<tr>
<td>${i.invoiceID}</td>
<td>$${i.amount}</td>
<td>${i.paymentStatus}</td>
</tr>`).join('')}
</table>`;
document.getElementById("adminData").innerHTML = table;
})
.catch(err => {
console.error(err);
document.getElementById("adminData").innerHTML = "<p>Error fetching invoices.</p>";
});
}

// --- ADMIN DASHBOARD: LOAD PAYMENTS ---
function loadPayments() {
document.getElementById("adminData").innerHTML = "<p>Loading payments...</p>";

fetch("/payments")
.then(res => res.json())
.then(data => {
const table = `
<table border="1" style="margin:auto;">
<tr><th>Payment ID</th><th>Method</th><th>Amount</th></tr>
${data.map(p => `
<tr>
<td>${p.paymentID}</td>
<td>${p.method}</td>
<td>$${p.totalAmount}</td>
</tr>`).join('')}
</table>`;
document.getElementById("adminData").innerHTML = table;
})
.catch(err => {
console.error(err);
document.getElementById("adminData").innerHTML = "<p>Error loading payments.</p>";
});
}
