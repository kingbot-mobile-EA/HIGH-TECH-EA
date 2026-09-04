import "dotenv/config";
import express from "express";
import cors from "cors";
import { handleDemo } from "./routes/demo";
import {
  handleMt5Account,
  handleMt5Connect,
  handleMt5Market,
  handleMt5Positions,
  handleMt5Status,
} from "./routes/mt5";

export function createServer() {
  const app = express();

  // Middleware
  app.use(cors());
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  // Example API routes
  app.get("/api/ping", (_req, res) => {
    const ping = process.env.PING_MESSAGE ?? "ping";
    res.json({ message: ping });
  });

  app.get("/api/demo", handleDemo);

  app.get("/api/mt5/status", handleMt5Status);
  app.post("/api/mt5/connect", handleMt5Connect);
  app.get("/api/mt5/account", handleMt5Account);
  app.get("/api/mt5/positions", handleMt5Positions);
  app.get("/api/mt5/market", handleMt5Market);

  return app;
}
