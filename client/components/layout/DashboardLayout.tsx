import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { Sheet, SheetContent } from "@/components/ui/sheet";

export function DashboardLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background bg-grid-glow">
      <div className="flex">
        <Sidebar />
        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetContent side="left" className="w-64 border-sidebar-border bg-sidebar p-0">
            <Sidebar mobile />
        </SheetContent>
        </Sheet>
        <div className="flex-1 min-w-0">
          <Topbar onMenuClick={() => setMobileOpen(true)} />
          <main className="px-4 py-5 lg:px-6 lg:py-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
