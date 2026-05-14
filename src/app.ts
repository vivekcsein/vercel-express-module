import express from "express";
import type { Request, Response } from "express";

const createApp = async (): Promise<express.Express> => {
  const app = express();

  // 🛣️ Routes
  app.get(["/", "/index", "/index.html"], (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Hello World!",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  });

  // 🩺 Health check
  app.get("/api/health", (_req: Request, res: Response) => {
    return res.status(200).json({
      success: true,
      message: "Server is healthy",
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
    });
  });

  return app;
};

export default createApp;
