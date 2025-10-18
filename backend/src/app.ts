import { connectionDatabase } from "@config/database";
import app from "./server";
import dotenv from "dotenv";

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Conectar a la base de datos primero
    await connectionDatabase();

    // Iniciar el servidor
    app.listen(PORT, () => {
      console.log(`
    Server Status:
   • Port: ${PORT}
   • Environment: ${process.env.NODE_ENV || "development"}
   • API Base: /api/${process.env.API_VERSION || "v1"}

    Available endpoints:
   • Health: http://localhost:${PORT}/health
   • Welcome: http://localhost:${PORT}/
   • API Info: http://localhost:${PORT}/api/${process.env.API_VERSION || "v1"}
      `);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

// Iniciar servidor
startServer();
