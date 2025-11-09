import { Request, Response, NextFunction } from "express";
import { ApiResponse } from "../types/order";

// Error personalizado para la aplicación
export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;

  constructor(message: string, statusCode: number = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = true;

    Error.captureStackTrace(this, this.constructor);
  }
}

// Middleware global de manejo de errores
export const globalErrorHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  let statusCode = 500;
  let message = "Internal Server Error";

  // Error personalizado de la aplicación
  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
  }

  // Error de validación
  else if (error.name === "ValidationError") {
    statusCode = 400;
    message = error.message;
  }

  // Error de base de datos PostgreSQL
  else if (error.code) {
    switch (error.code) {
      case "23505": // Unique violation
        statusCode = 409;
        message = "Resource already exists";
        break;
      case "23503": // Foreign key violation
        statusCode = 400;
        message = "Invalid reference";
        break;
      case "23502": // Not null violation
        statusCode = 400;
        message = "Required field missing";
        break;
      case "22P02": // Invalid UUID
        statusCode = 400;
        message = "Invalid ID format";
        break;
      default:
        message = "Database error";
    }
  }

  // Log del error para debugging
  console.error(`❌ [${new Date().toISOString()}] Error:`, {
    message: error.message,
    stack: error.stack,
    url: req.originalUrl,
    method: req.method,
    body: req.body,
  });

  const response: ApiResponse = {
    success: false,
    message,
    error: process.env.NODE_ENV === "development" ? error.message : undefined,
  };

  res.status(statusCode).json(response);
};

// Middleware para capturar errores async
export const asyncHandler = (fn: Function) => {
  return (req: Request, res: Response, next: NextFunction) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
};
