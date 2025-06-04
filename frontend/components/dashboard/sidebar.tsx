"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  BarChart3,
  Home,
  Users,
  Settings,
  HelpCircle,
  X,
  LineChart,
  LayoutDashboard,
  CreditCard,
  Search,
  Bell,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const pathname = usePathname();

  const routes = [
    {
      label: "Dashboard",
      icon: LayoutDashboard,
      href: "/",
      color: "text-sky-500",
    },
    {
      label: "Analytics",
      icon: BarChart3,
      href: "/analytics",
      color: "text-violet-500",
    },
    {
      label: "Reports",
      icon: LineChart,
      href: "/reports",
      color: "text-pink-500",
    },
    {
      label: "Customers",
      icon: Users,
      color: "text-orange-500",
      href: "/customers",
    },
    {
      label: "Transactions",
      icon: CreditCard,
      color: "text-green-500",
      href: "/transactions",
    },
    {
      label: "Notifications",
      icon: Bell,
      color: "text-yellow-500",
      href: "/notifications",
    },
    {
      label: "Search",
      icon: Search,
      color: "text-blue-500",
      href: "/search",
    },
    {
      label: "Settings",
      icon: Settings,
      href: "/settings",
    },
    {
      label: "Help",
      icon: HelpCircle,
      href: "/help",
    },
  ];

  return (
    <>
      {/* Overlay for mobile */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm md:hidden"
          onClick={onClose}
        />
      )}
      
      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-72 border-r bg-background p-6 shadow-lg transition-transform duration-300 md:relative md:z-0 md:transform-none",
          open ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span className="text-xl font-bold">Analytics</span>
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
            <span className="sr-only">Close sidebar</span>
          </Button>
        </div>
        <div className="mt-8 space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors hover:bg-accent",
                pathname === route.href
                  ? "bg-accent text-accent-foreground"
                  : "text-muted-foreground"
              )}
            >
              <route.icon className={cn("h-5 w-5", route.color || "")} />
              {route.label}
            </Link>
          ))}
        </div>
      </div>
    </>
  );
}