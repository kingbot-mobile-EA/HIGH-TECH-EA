import { Bell, Sparkles, Target, TrendingUp, Menu } from "lucide-react";
import { useMt5Status } from "@/hooks/use-mt5";
import { cn } from "@/lib/utils";

const BADGES = [
  { icon: Sparkles, label: "AI Powered" },
  { icon: Target, label: "Real Strategies" },
  { icon: TrendingUp, label: "Real Results" },
];

export function Topbar({ onMenuClick }: { onMenuClick?: () => void }) {
  const { data: status } = useMt5Status();
  const connected = status?.state === "connected";

  return (
    <header className="sticky top-0 z-30 flex items-center justify-between gap-4 border-b border-border bg-background/80 px-4 py-3 backdrop-blur-md lg:px-6">
      <div className="flex items-center gap-4 min-w-0">
        <button
          onClick={onMenuClick}
          className="rounded-lg p-2 text-muted-foreground hover:bg-accent lg:hidden"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden items-center gap-2 md:flex">
          {BADGES.map((b) => (
            <span
              key={b.label}
              className="flex items-center gap-1.5 rounded-full border border-border bg-card px-3 py-1 text-xs font-semibold text-muted-foreground"
            >
              <b.icon className="h-3.5 w-3.5 text-primary" />
              {b.label}
            </span>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <span
          className={cn(
            "hidden items-center gap-2 rounded-full border px-3 py-1 text-xs font-bold sm:flex",
            connected
              ? "border-success/30 bg-success/10 text-success"
              : "border-border bg-card text-muted-foreground",
          )}
        >
          <span
            className={cn(
              "h-2 w-2 rounded-full",
              connected ? "bg-success animate-pulse-glow" : "bg-muted-foreground",
            )}
          />
          {connected ? "Live Trading" : "Not Connected"}
        </span>
        <button className="relative rounded-lg p-2 text-muted-foreground hover:bg-accent hover:text-foreground">
          <Bell className="h-5 w-5" />
          <span className="absolute right-1.5 top-1.5 h-1.5 w-1.5 rounded-full bg-destructive" />
        </button>
        <div className="flex items-center gap-2 rounded-lg border border-border bg-card px-2.5 py-1.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-primary to-secondary text-xs font-bold text-primary-foreground">
            TB
          </div>
          <span className="hidden text-sm font-semibold sm:inline">
            TraderBotTech
          </span>
        </div>
      </div>
    </header>
  );
}
