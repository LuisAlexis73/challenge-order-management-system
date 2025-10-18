import dotenv from "dotenv";
import { Pool } from "pg";

dotenv.config();

const dbPort = process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432;

interface DatabaseConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
}

const config: DatabaseConfig = {
  host: process.env.DB_HOST!,
  port: dbPort,
  database: process.env.DB_NAME!,
  user: process.env.DB_USER!,
  password: process.env.DB_PASSWORD!,
};

// Crear pool de conexiones
export const pool = new Pool(config);

// Función para conectar a la base de datos
export const connectionDatabase = async (): Promise<void> => {
  try {
    const client = await pool.connect();
    console.log("Database connection successful");

    const result = await client.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_name = 'orders'
    `);

    if (result.rows.length > 0) {
      console.log("Table 'orders' found");
    } else {
      console.error(
        "Table 'orders' not found - make sure to run database initialization",
      );
    }

    client.release();
  } catch (error) {
    console.error("Database connection error:", error);
    throw error;
  }
};

// Función para cerrar la conexión a la base de datos
export const closeDatabase = async (): Promise<void> => {
  try {
    await pool.end();
    console.log("Database connection closed");
  } catch (error) {
    console.error("Error closing database connections:", error);
  }
};

// Manejar cierre de aplicación
process.on("SIGINT", async () => {
  console.log("\n Shutting down gracefully...");
  await closeDatabase();
  process.exit(0);
});

process.on("SIGTERM", async () => {
  console.log("\n Shutting down gracefully...");
  await closeDatabase();
  process.exit(0);
});
