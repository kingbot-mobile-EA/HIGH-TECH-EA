import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  Mt5AccountResponse,
  Mt5ConnectRequest,
  Mt5MarketResponse,
  Mt5PositionsResponse,
  Mt5StatusResponse,
} from "@shared/api";

const WATCHLIST = ["XAUUSDm", "EURUSDm", "GBPUSDm", "US30m", "BTCUSDm"];

export function useMt5Status() {
  return useQuery({
    queryKey: ["mt5-status"],
    queryFn: async () => {
      const res = await fetch("/api/mt5/status");
      return (await res.json()) as Mt5StatusResponse;
    },
    refetchInterval: 5000,
  });
}

export function useMt5Connect() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (payload: Mt5ConnectRequest) => {
      const res = await fetch("/api/mt5/connect", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message ?? "Failed to connect");
      return data as Mt5StatusResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["mt5-status"] });
    },
  });
}

export function useMt5Account(enabled: boolean) {
  return useQuery({
    queryKey: ["mt5-account"],
    queryFn: async () => {
      const res = await fetch("/api/mt5/account");
      if (!res.ok) throw new Error("Account unavailable");
      return (await res.json()) as Mt5AccountResponse;
    },
    enabled,
    refetchInterval: 4000,
    retry: false,
  });
}

export function useMt5Positions(enabled: boolean) {
  return useQuery({
    queryKey: ["mt5-positions"],
    queryFn: async () => {
      const res = await fetch("/api/mt5/positions");
      if (!res.ok) throw new Error("Positions unavailable");
      return (await res.json()) as Mt5PositionsResponse;
    },
    enabled,
    refetchInterval: 4000,
    retry: false,
  });
}

export function useMt5Market(enabled: boolean) {
  return useQuery({
    queryKey: ["mt5-market"],
    queryFn: async () => {
      const res = await fetch(`/api/mt5/market?symbols=${WATCHLIST.join(",")}`);
      if (!res.ok) throw new Error("Market data unavailable");
      return (await res.json()) as Mt5MarketResponse;
    },
    enabled,
    refetchInterval: 3000,
    retry: false,
  });
}

export { WATCHLIST };
