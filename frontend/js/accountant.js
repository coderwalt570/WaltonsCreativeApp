async function loadAccountantData() {
  try {
    const res = await fetch('/api/data/accountant');
    const { data } = await res.json();

    console.log("Accountant Data Loaded:", data);

    // INVOICES
    const invoiceList = document.getElementById('invoiceList');
    invoiceList.innerHTML = data.invoices.length
      ? data.invoices
          .map(i => `
            <li>
              <strong>Invoice #${i.invoiceID}</strong><br>
              Project: ${i.projectID}<br>
              Amount: $${i.amount}<br>
              Status: ${i.paymentStatus}<br>
              Issued: ${new Date(i.dateIssued).toLocaleDateString()}
            </li>
          `)
          .join('')
      : "<li>No invoices available.</li>";

    // PAYMENTS
    const paymentList = document.getElementById('paymentList');
    paymentList.innerHTML = data.payments.length
      ? data.payments
          .map(p => `
            <li>
              <strong>Payment #${p.paymentID}</strong><br>
              Invoice: ${p.invoiceID}<br>
              Method: ${p.method}<br>
              Amount: $${p.totalAmount}<br>
              Date: ${new Date(p.transactionDate).toLocaleDateString()}
            </li>
          `)
          .join('')
      : "<li>No payments available.</li>";

  } catch (err) {
    console.error("Dashboard Load Error:", err);
    alert("Error loading accountant dashboard");
  }
}

loadAccountantData();
