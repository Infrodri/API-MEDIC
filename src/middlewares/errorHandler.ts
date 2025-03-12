// src/middlewares/errorHandler.ts
import { Request, Response, NextFunction } from "express";

export const errorHandler = (error: any, req: Request, res: Response, next: NextFunction) => {
  console.error(`Error in ${req.method} ${req.url}:`, error);
  res.status(500).json({
    success: false,
    message: error.message || "Error interno del servidor",
    error: String(error),
  });
};