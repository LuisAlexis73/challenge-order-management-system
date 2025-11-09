import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/order";

// Middleware para validar JSON válido
export const validateJsonMiddleware = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof SyntaxError && "body" in error) {
    const response: ApiResponse = {
      success: false,
      message: "Invalid JSON format",
      error: "Request body must be valid JSON",
    };
    return res.status(400).json(response);
  }
  next(error);
};

// Middleware para validar Content-Type en POST/PUT
export const validateContentType = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (["POST", "PUT", "PATCH"].includes(req.method)) {
    const contentType = req.get("Content-Type");

    if (!contentType || !contentType.includes("application/json")) {
      const response: ApiResponse = {
        success: false,
        message: "Invalid Content-Type",
        error: "Content-Type must be application/json",
      };
      return res.status(400).json(response);
    }
  }
  next();
};

// Middleware para logging de requests
export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  const timestamp = new Date().toISOString();
  console.log(`📝 [${timestamp}] ${req.method} ${req.originalUrl}`);

  // Log body para POST/PUT (sin datos sensibles)
  if (["POST", "PUT"].includes(req.method) && req.body) {
    console.log(`   Body:`, JSON.stringify(req.body, null, 2));
  }

  next();
};

// Middleware para manejar rutas no encontradas específicas de orders
export const orderNotFound = (req: Request, res: Response) => {
  const response: ApiResponse = {
    success: false,
    message: `Order endpoint ${req.originalUrl} not found`,
    error: `Method ${req.method} not supported for this endpoint`,
  };
  res.status(404).json(response);
};
