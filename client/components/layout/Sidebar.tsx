import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  ScanLine,
  BrainCircuit,
  ListChecks,
  History,
  LineChart,
  ShieldAlert,
  Settings,
  HelpCircle,
  Wifi,
  WifiOff,
  Rocket,
  ExternalLink,
  Search,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useMt5Status } from "@/hooks/use-mt5";

const NAV_ITEMS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
  { to: "/scanner", label: "Live Market Scanner", icon: ScanLine },
  { to: "/strategies", label: "AI Strategies", icon: BrainCircuit },
  { to: "/trades/open", label: "Open Trades", icon: ListChecks },
  { to: "/trades/history", label: "Trade History", icon: History },
  { to: "/performance", label: "Performance", icon: LineChart },
  { to: "/risk", label: "Risk Management", icon: ShieldAlert },
  { to: "/settings", label: "Settings", icon: Settings },
  { to: "/help", label: "Help & Support", icon: HelpCircle },
];

export function Sidebar() {
  const location = useLocation();
  const { data: status } = useMt5Status();
  const connected = status?.state === "connected";

  return (
    <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r border-sidebar-border bg-sidebar h-screen sticky top-0">
      <div className="flex items-center gap-3 px-5 py-5 border-b border-sidebar-border">
        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-secondary font-black text-primary-foreground shadow-glow-sm">
          TBT
        </div>
        <div className="min-w-0">
          <div className="text-sm font-extrabold tracking-tight text-foreground">
            TRADERBOTTECH
          </div>
          <div className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            Intelligent MTS Trading System
          </div>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto scrollbar-thin px-3 py-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = location.pathname === item.to;
          return (
            <Link
              key={item.to}
              to={item.to}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                active
                  ? "bg-primary/10 text-primary shadow-[inset_0_0_0_1px_hsl(var(--primary)/0.35)]"
                  : "text-sidebar-foreground hover:bg-sidebar-accent hover:text-foreground",
              )}
            >
              <item.icon className="h-4 w-4 shrink-0" />
              <span className="truncate">{item.label}</span>
            </Link>
          );
        })}
      </nav>

      <div className="px-3 pb-3">
        <div className="rounded-xl border border-sidebar-border bg-card/60 p-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground">
              MT5 Connection
            </span>
            <span
              className={cn(
                "flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-bold",
                connected
                  ? "bg-success/15 text-success"
                  : "bg-muted text-muted-foreground",
              )}
            >
              {connected ? (
                <Wifi className="h-3 w-3" />
              ) : (
                <WifiOff className="h-3 w-3" />
              )}
              {connected ? "ONLINE" : "OFFLINE"}
            </span>
          </div>
          {connected ? (
            <div className="mt-2 space-y-0.5 text-xs">
              <div className="font-semibold text-foreground truncate">
                {status?.server}
              </div>
              <div className="text-muted-foreground">
                Account: {status?.login}
              </div>
            </div>
          ) : (
            <p className="mt-2 text-xs text-muted-foreground">
              Connect your live MT5 account to start streaming real data.
            </p>
          )}
        </div>

        <div className="mt-3 space-y-2">
          <p className="px-1 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            Quick Actions
          </p>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg bg-success py-2.5 text-sm font-bold text-success-foreground shadow-glow-success transition-transform hover:scale-[1.02]">
            <Rocket className="h-4 w-4" /> Start Auto Trading
          </button>
          <button className="flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-sidebar-accent/70">
            <ExternalLink className="h-4 w-4" /> Open MT5
          </button>
          <Link
            to="/scanner"
            className="flex w-full items-center justify-center gap-2 rounded-lg border border-sidebar-border bg-sidebar-accent py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-sidebar-accent/70"
          >
            <Search className="h-4 w-4" /> Market Scanner
          </Link>
        </div>
      </div>
    </aside>
  );
}
