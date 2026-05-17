import path from "path";
import express from "express";
import type { Request, Response } from "express";
import { notFoundHandler } from "./packages/utils/utils.handler";

// Middlewares
// import dotenv from "dotenv";
import compression from "compression";
import cookieParser from "cookie-parser";
// import helmetMiddleware from "./packages/middlewares/helmet";
// import { corsMiddleware } from "./packages/middlewares/cors";
// import { generalLimiter } from "./packages/middlewares/rateLimit";

const createApp = async (): Promise<express.Express> => {
  // 🌿 Load environment variables
  // dotenv.config();

  // 🚀 Create Express app
  const app = express();
  
    // 🔐 Security headers
  // app.use(helmetMiddleware);

    // 🧊 Compression for faster responses
  app.use(compression());

    // 🍪 Cookie and CORS
  // app.use(corsMiddleware);
  app.use(cookieParser());

  // 📦 Body parsers
  app.use(express.json({ limit: "10mb" }));
  app.use(express.urlencoded({ extended: true }));

    // 🚦 Rate limiter BEFORE routes
  // app.use(generalLimiter);

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

  // 🧹 Catch-all 404 and error handler
  app.use(notFoundHandler);
  // app.use(errorHandler);

  return app;
};

export default createApp;
