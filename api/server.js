// Load environment variables
require('dotenv').config();

const express = require('express');
const sql = require('mssql');
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to handle JSON requests
app.use(express.json());

// Database configuration using .env values
const dbConfig = {
user: process.env.DB_USER,
password: process.env.DB_PASSWORD,
server: process.env.DB_SERVER,
database: process.env.DB_DATABASE,
options: {
encrypt: false, // Set to true if connecting to Azure SQL
trustServerCertificate: true // Required for local SQL Express
}
};

// Connect to SQL Server
async function connectDB() {
try {
await sql.connect(dbConfig);
console.log(`✅ Connected to SQL Server: ${process.env.DB_DATABASE}`);
} catch (err) {
console.error('❌ Database connection failed:', err.message);
}
}
connectDB();

// ------------------- ROUTES ------------------- //

// Root route
app.get('/', (req, res) => {
res.send('Walton’s Creative Studio Financial Management API is running.');
});

// Get all clients
app.get('/clients', async (req, res) => {
try {
const result = await sql.query`SELECT * FROM Clients`;
res.json(result.recordset);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Get all invoices
app.get('/invoices', async (req, res) => {
try {
const result = await sql.query`SELECT * FROM Invoices`;
res.json(result.recordset);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Get all payments
app.get('/payments', async (req, res) => {
try {
const result = await sql.query`SELECT * FROM Payments`;
res.json(result.recordset);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Get financial report summary
app.get('/financial-summary', async (req, res) => {
try {
const result = await sql.query(`
SELECT
(SELECT COUNT(*) FROM Clients) AS totalClients,
(SELECT COUNT(*) FROM Invoices) AS totalInvoices,
(SELECT SUM(Amount) FROM Payments) AS totalPayments
`);
res.json(result.recordset[0]);
} catch (err) {
res.status(500).json({ error: err.message });
}
});

// Start the server
app.listen(PORT, () => {
console.log(`🚀 Server running on http://localhost:${PORT}`);
});

