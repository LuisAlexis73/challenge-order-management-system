import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

// Importar rutas y middlewares
import orderRoutes from "./routes/order.routes";
import {
  validateJsonMiddleware,
  validateContentType,
  requestLogger,
} from "./middlewares/validation";
import { globalErrorHandler } from "./middlewares/error-handler";

const app = express();

// Middlewares de seguridad
app.use(helmet());
app.use(
  cors({
    origin:
      process.env.NODE_ENV === "production"
        ? ["https://yourdomain.com"]
        : ["http://localhost:3000", "http://localhost:5173"],
    credentials: true,
  }),
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100,
  message: {
    success: false,
    message: "Too many requests from this IP, please try again later.",
  },
});
app.use("/api", limiter);

// Middlewares de parsing
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true }));

// Middleware para validar JSON
app.use(validateJsonMiddleware);

// Middleware de logging
app.use(requestLogger);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Order Management API is running",
    timestamp: new Date().toISOString(),
    version: process.env.npm_package_version || "1.0.0",
  });
});

// Ruta de bienvenida
app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "🚀 Welcome to Order Management System API",
    endpoints: {
      health: "/health",
      api_base: `/api/${process.env.API_VERSION || "v1"}`,
      orders: `/api/${process.env.API_VERSION || "v1"}/orders`,
      documentation: "/api-docs",
    },
    status: "Server is running successfully",
  });
});

// API routes
const API_VERSION = process.env.API_VERSION || "v1";

// Middleware para todas las rutas de API
app.use(`/api/${API_VERSION}`, validateContentType);

// Rutas de órdenes
app.use(`/api/${API_VERSION}/orders`, orderRoutes);

// Ruta de información de API
app.get(`/api/${API_VERSION}`, (req, res) => {
  res.status(200).json({
    success: true,
    message: `Order Management API ${API_VERSION}`,
    endpoints: {
      "GET /orders": "Get paginated orders list",
      "GET /orders/:id": "Get order by ID",
      "POST /orders": "Create new order",
      "PUT /orders/:id": "Update order",
      "DELETE /orders/:id": "Delete order",
    },
    status: "All CRUD endpoints are now available! 🎉",
  });
});

// Middleware para rutas no encontradas
app.use("/", (req, res) => {
  res.status(404).json({
    success: false,
    message: `Route ${req.originalUrl} not found`,
    available_routes: [
      "/",
      "/health",
      `/api/${API_VERSION}`,
      `/api/${API_VERSION}/orders`,
    ],
  });
});

// Middleware global de manejo de errores (debe ir al final)
app.use(globalErrorHandler);

export default app;
