import http from "http";
import process from "process";
import app from "./app.js";
import "dotenv/config";
import { connectDB } from "./mongo/mongodb.js";

const PORT = Number(process.env.PORT) || 3000;

async function startServer() {
  await connectDB();

  const server = http.createServer(app);

  server.on("listening", () => {
    console.log(`HTTP server listening on port ${PORT}`);
  });

  server.on("error", (err) => {
    console.error("Server error:", err);
    process.exit(1);
  });

  server.listen(PORT);
}

startServer();
