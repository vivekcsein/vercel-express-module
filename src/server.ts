import createApp from "./app";

// ✅ Start server with safe async handling
const startServer = async (): Promise<void> => {
  try {
    const app = await createApp();

    const APP_PORT = process.env.PORT || 4000;

    const server = app.listen(APP_PORT, () => {
      console.log(`🚀 Server running on port http://localhost:${APP_PORT}`);
      console.log(`📚 API docs available at http://localhost:${APP_PORT}/api/documentation`);
    });

    // ✅ Graceful shutdown
    const shutdown = (signal: string) => {
      console.log(`🛑 Received ${signal}. Shutting down gracefully...`);
      server.close(() => {
        console.log("✅ Server closed.");
        process.exit(0);
      });
    };

    process.on("SIGINT", () => shutdown("SIGINT"));
    process.on("SIGTERM", () => shutdown("SIGTERM"));
  } catch (err) {
    console.error("❌ Failed to start server:", err instanceof Error ? err.message : err);
    process.exit(1);
  }
};

void startServer();
