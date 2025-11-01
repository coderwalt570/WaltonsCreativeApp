// api/server.js
const express = require('express');
const sql = require('mssql');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../')));

// SQL Server Configuration
const dbConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  server: process.env.DB_SERVER, // e.g., "LAPTOP\\SQLEXPRESS" or Azure SQL endpoint
  database: process.env.DB_NAME,
  options: {
    encrypt: true,
    trustServerCertificate: true
  }
};

// Connect to SQL Server
sql.connect(dbConfig)
  .then(() => console.log("✅ Connected to SQL Server"))
  .catch(err => console.error("❌ Database Connection Failed:", err));

// Routes
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../index.html'));
});

// Example: Get all clients
app.get('/clients', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Clients`;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

// Example: Get invoices
app.get('/invoices', async (req, res) => {
  try {
    const result = await sql.query`SELECT * FROM Invoices`;
    res.json(result.recordset);
  } catch (err) {
    console.error(err);
    res.status(500).send('Server error');
  }
});

app.listen(port, () => {
  console.log(`🚀 Server running on port ${port}`);
});
