import sql from "mssql/msnodesqlv8.js";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: process.env.DB_DRIVER,
  options: { trustedConnection: true }
};

try {
  const pool = await sql.connect(dbConfig);
  console.log("Database connection successful!");
  await pool.close();
} catch (err) {
  console.error("Database connection failed:", err);
}
