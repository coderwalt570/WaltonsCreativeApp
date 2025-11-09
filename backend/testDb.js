import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: process.env.DB_DRIVER,
  options: { trustedConnection: true }
};

console.log("Attempting to connect with config:", dbConfig);

try {
  const pool = await sql.connect(dbConfig);
  console.log("✅ Database connection successful!");
  await pool.close();
} catch (err) {
  console.error("❌ Database connection failed:");

// Log everything we can from the error object
console.error("Error:", JSON.stringify(err, Object.getOwnPropertyNames(err), 2));
}
