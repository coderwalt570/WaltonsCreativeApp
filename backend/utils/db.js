import sql from "mssql";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  options: {
    encrypt: false,  // local SQL Server does not use encryption
    trustServerCertificate: true
  }
};

export async function executeQuery(query, params = []) {
  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    params.forEach(p => request.input(p.name, p.type, p.value));

    const result = await request.query(query);
    return result.recordset;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
}

export { sql };
