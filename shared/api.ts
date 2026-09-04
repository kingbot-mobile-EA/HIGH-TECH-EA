/**
 * Shared code between client and server
 */

export interface DemoResponse {
  message: string;
}

export interface Mt5ConnectRequest {
  login: string;
  password: string;
  server: string;
}

export type Mt5AccountState =
  | "not_configured"
  | "disconnected"
  | "connecting"
  | "deploying"
  | "connected"
  | "error";

export interface Mt5StatusResponse {
  configured: boolean;
  state: Mt5AccountState;
  accountId?: string;
  login?: string;
  server?: string;
  message?: string;
}

export interface Mt5AccountInfo {
  balance: number;
  equity: number;
  margin: number;
  freeMargin: number;
  marginLevel: number;
  currency: string;
  leverage: number;
  broker: string;
  name: string;
  server: string;
}

export interface Mt5Position {
  id: string;
  symbol: string;
  type: "BUY" | "SELL";
  volume: number;
  openPrice: number;
  currentPrice: number;
  profit: number;
  time: string;
}

export interface Mt5Quote {
  symbol: string;
  bid: number;
  ask: number;
  changePercent: number;
}

export interface Mt5AccountResponse {
  account: Mt5AccountInfo;
}

export interface Mt5PositionsResponse {
  positions: Mt5Position[];
}

export interface Mt5MarketResponse {
  quotes: Mt5Quote[];
}
