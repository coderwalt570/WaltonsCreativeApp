import sql from "mssql/msnodesqlv8";
import dotenv from "dotenv";
dotenv.config();

const dbConfig = {
  server: process.env.DB_SERVER,
  database: process.env.DB_DATABASE,
  driver: process.env.DB_DRIVER,
  options: {
    trustedConnection: true,   // 
    trustServerCertificate: true, // 
  }
};

export async function executeQuery(query, params = []) {
  try {
    const pool = await sql.connect(dbConfig);
    const request = pool.request();

    params.forEach(p => request.input(p.name, p.type, p.value));

    return (await request.query(query)).recordset;
  } catch (error) {
    console.error("Database Query Error:", error);
    throw error;
  }
}

export { sql };
