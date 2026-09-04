import {
  Mt5AccountInfo,
  Mt5AccountState,
  Mt5Position,
  Mt5Quote,
} from "@shared/api";

const PROVISIONING_BASE = "https://mt-provisioning-api-v1.agiliumtrade.ai";
const CLIENT_BASE = "https://mt-client-api-v1.agiliumtrade.ai";

interface SessionState {
  accountId: string;
  login: string;
  server: string;
  state: Mt5AccountState;
  message?: string;
}

let session: SessionState | null = null;

function getToken() {
  return process.env.METAAPI_TOKEN;
}

async function metaApiFetch(base: string, path: string, init?: RequestInit) {
  const token = getToken();
  if (!token) {
    throw new Error("METAAPI_TOKEN is not configured");
  }
  const res = await fetch(`${base}${path}`, {
    ...init,
    headers: {
      "auth-token": token,
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(
      `MetaApi request failed (${res.status}) for ${path}: ${text}`,
    );
  }
  if (res.status === 204) return null;
  return res.json();
}

export function isConfigured() {
  return Boolean(getToken());
}

export function getSession(): SessionState | null {
  return session;
}

export async function connectAccount(login: string, password: string, server: string) {
  session = { accountId: "", login, server, state: "connecting" };

  const existing = (await metaApiFetch(
    PROVISIONING_BASE,
    "/users/current/accounts",
  ).catch(() => [])) as any[];

  let account = Array.isArray(existing)
    ? existing.find((a) => a.login === login && a.server === server)
    : null;

  if (!account) {
    account = await metaApiFetch(PROVISIONING_BASE, "/users/current/accounts", {
      method: "POST",
      body: JSON.stringify({
        login,
        password,
        server,
        name: `TraderBotTech-${login}`,
        platform: "mt5",
        magic: 0,
      }),
    });
  }

  session = {
    accountId: account.id ?? account._id,
    login,
    server,
    state: "deploying",
  };

  await metaApiFetch(
    PROVISIONING_BASE,
    `/users/current/accounts/${session.accountId}/deploy`,
    { method: "POST" },
  ).catch(() => null);

  session.state = "connected";
  return session;
}

async function ensureConnected() {
  if (!session) throw new Error("No MT5 account connected");
  return session;
}

export async function fetchAccountInfo(): Promise<Mt5AccountInfo> {
  const s = await ensureConnected();
  const info = await metaApiFetch(
    CLIENT_BASE,
    `/users/current/accounts/${s.accountId}/account-information`,
  );
  return {
    balance: info.balance,
    equity: info.equity,
    margin: info.margin,
    freeMargin: info.freeMargin,
    marginLevel: info.marginLevel,
    currency: info.currency,
    leverage: info.leverage,
    broker: info.broker,
    name: info.name,
    server: s.server,
  };
}

export async function fetchPositions(): Promise<Mt5Position[]> {
  const s = await ensureConnected();
  const positions = (await metaApiFetch(
    CLIENT_BASE,
    `/users/current/accounts/${s.accountId}/positions`,
  )) as any[];
  return positions.map((p) => ({
    id: String(p.id),
    symbol: p.symbol,
    type: p.type === "POSITION_TYPE_SELL" ? "SELL" : "BUY",
    volume: p.volume,
    openPrice: p.openPrice,
    currentPrice: p.currentPrice,
    profit: p.profit,
    time: p.time,
  }));
}

export async function fetchQuotes(symbols: string[]): Promise<Mt5Quote[]> {
  const s = await ensureConnected();
  const quotes = await Promise.all(
    symbols.map(async (symbol) => {
      const price = await metaApiFetch(
        CLIENT_BASE,
        `/users/current/accounts/${s.accountId}/symbols/${symbol}/current-price`,
      );
      const bid = price.bid;
      const ask = price.ask;
      const prevClose = price.close ?? bid;
      const changePercent = prevClose ? ((bid - prevClose) / prevClose) * 100 : 0;
      return { symbol, bid, ask, changePercent } as Mt5Quote;
    }),
  );
  return quotes;
}
