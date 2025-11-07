import sql from "mssql/msnodesqlv8.js";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: process.env.DB_DRIVER,
  options: {
    trustedConnection: true
  }
};

export const executeQuery = async (query, params = []) => {
  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();
    params.forEach(p => request.input(p.name, p.type, p.value));
    const result = await request.query(query);
    return result.recordset;
  } catch (err) {
    console.error("Database Error:", err);
    throw err;
  }
};

// ✅ Export sql so controllers can use sql.VarChar, sql.Int, etc.
export { sql };
