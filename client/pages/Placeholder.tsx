import { Construction, ArrowLeft } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { DashboardLayout } from "@/components/layout/DashboardLayout";

export default function Placeholder() {
  const { pathname } = useLocation();
  const title = pathname.split("/").filter(Boolean).map((part) => part.replace(/-/g, " ")).join(" / ") || "Dashboard";
  return <DashboardLayout><div className="flex min-h-[60vh] items-center justify-center"><div className="max-w-md text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/30 bg-primary/10 text-primary"><Construction className="h-8 w-8" /></div><h1 className="mt-5 text-2xl font-extrabold capitalize">{title}</h1><p className="mt-2 text-sm text-muted-foreground">This workspace is ready for the next module. Continue prompting to build out this page with the same live MT5 data and risk controls.</p><Link to="/" className="mt-6 inline-flex items-center gap-2 rounded-lg border border-border px-4 py-2 text-sm font-bold text-primary hover:bg-primary/10"><ArrowLeft className="h-4 w-4" /> Back to dashboard</Link></div></div></DashboardLayout>;
}
