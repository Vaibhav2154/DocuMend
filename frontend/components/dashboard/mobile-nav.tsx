"use client";

import { Menu } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileNav({ 
  setSidebarOpen 
}: { 
  setSidebarOpen: (open: boolean) => void 
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      className="md:hidden"
      onClick={() => setSidebarOpen(true)}
    >
      <Menu className="h-5 w-5" />
      <span className="sr-only">Toggle sidebar</span>
    </Button>
  );
}