import path from "path";
import express from "express";
import type { Request, Response } from "express";

const createApp = async (): Promise<express.Express> => {
  const app = express();

    // 📦 Body parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

  // 🧱 Static assets
  const viewsPath = path.join(process.cwd(), "src/assets/views");
  app.use(express.static(viewsPath, { maxAge: "1d", etag: true }));

  // 🛣️ Routes
  app.get(["/", "/index", "/index.html"], (_req: Request, res: Response) => {
    res.type("html").sendFile(path.join(viewsPath, "index.html"));
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
