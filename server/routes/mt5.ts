import { RequestHandler } from "express";
import {
  Mt5AccountResponse,
  Mt5ConnectRequest,
  Mt5MarketResponse,
  Mt5PositionsResponse,
  Mt5StatusResponse,
} from "@shared/api";
import {
  connectAccount,
  fetchAccountInfo,
  fetchPositions,
  fetchQuotes,
  getSession,
  isConfigured,
} from "../lib/metaapi";

export const handleMt5Status: RequestHandler = (_req, res) => {
  const session = getSession();
  const response: Mt5StatusResponse = {
    configured: isConfigured(),
    state: session?.state ?? (isConfigured() ? "disconnected" : "not_configured"),
    accountId: session?.accountId,
    login: session?.login,
    server: session?.server,
    message: session?.message,
  };
  res.json(response);
};

export const handleMt5Connect: RequestHandler = async (req, res) => {
  if (!isConfigured()) {
    res.status(400).json({ message: "METAAPI_TOKEN is not configured on the server" });
    return;
  }
  const { login, password, server } = req.body as Mt5ConnectRequest;
  if (!login || !password || !server) {
    res.status(400).json({ message: "login, password and server are required" });
    return;
  }
  try {
    const session = await connectAccount(login, password, server);
    res.json({ configured: true, state: session.state, accountId: session.accountId } satisfies Mt5StatusResponse);
  } catch (error) {
    res.status(502).json({ message: error instanceof Error ? error.message : "Failed to connect to MT5" });
  }
};

export const handleMt5Account: RequestHandler = async (_req, res) => {
  try {
    const account = await fetchAccountInfo();
    res.json({ account } satisfies Mt5AccountResponse);
  } catch (error) {
    res.status(409).json({ message: error instanceof Error ? error.message : "Account unavailable" });
  }
};

export const handleMt5Positions: RequestHandler = async (_req, res) => {
  try {
    const positions = await fetchPositions();
    res.json({ positions } satisfies Mt5PositionsResponse);
  } catch (error) {
    res.status(409).json({ message: error instanceof Error ? error.message : "Positions unavailable" });
  }
};

export const handleMt5Market: RequestHandler = async (req, res) => {
  const symbolsParam = typeof req.query.symbols === "string" ? req.query.symbols : "";
  const symbols = symbolsParam.split(",").filter(Boolean);
  if (symbols.length === 0) {
    res.json({ quotes: [] } satisfies Mt5MarketResponse);
    return;
  }
  try {
    const quotes = await fetchQuotes(symbols);
    res.json({ quotes } satisfies Mt5MarketResponse);
  } catch (error) {
    res.status(409).json({ message: error instanceof Error ? error.message : "Market data unavailable" });
  }
};
