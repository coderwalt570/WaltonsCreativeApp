document.getElementById('loginBtn').addEventListener('click', function() {
  alert('Login feature coming soon!');
});

function viewIvoices() {
  document.getElementById("invoiceList").innerHTML = "<p>Invoice #001 - $500 - Pending</p>";
}

function loadInvoices() {
  document.getElementById("adminData").innerHTML = "<p>All invoices displayed here.</p>";
}

function loadPayments() {
  document.getElementById("adminData").innerHTML = "<p>All payments displayed here.</p>";
}
