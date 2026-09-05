import "./global.css";

import { Toaster } from "@/components/ui/toaster";
import { createRoot } from "react-dom/client";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import NotFound from "./pages/NotFound";
import Placeholder from "./pages/Placeholder";
import Strategies from "./pages/Strategies";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/scanner" element={<Placeholder />} />
          <Route path="/strategies" element={<Strategies />} />
          <Route path="/trades/open" element={<Placeholder />} />
          <Route path="/trades/history" element={<Placeholder />} />
          <Route path="/performance" element={<Placeholder />} />
          <Route path="/risk" element={<Placeholder />} />
          <Route path="/settings" element={<Placeholder />} />
          <Route path="/help" element={<Placeholder />} />
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

const rootContainer = document.getElementById("root");
if (!rootContainer) throw new Error("Root container not found");

const appGlobal = globalThis as typeof globalThis & {
  __traderBotTechRoot?: ReturnType<typeof createRoot>;
};

const root = appGlobal.__traderBotTechRoot ?? createRoot(rootContainer);
appGlobal.__traderBotTechRoot = root;
root.render(<App />);
