"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FileText, ScanText, Sparkles, TrendingUp, Users } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import dynamic from "next/dynamic";

const ModeToggle = dynamic(() => import("@/components/mode-toggle").then(mod => mod.ModeToggle), { 
  ssr: false,
  loading: () => <div className="w-9 h-9 bg-muted rounded-md animate-pulse"></div>
});

export function Navigation() {
  const pathname = usePathname();

  return (
    <header className="border-b bg-background/95 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50 shadow-sm">
      <div className="container mx-auto max-w-7xl px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link href="/" className="flex items-center space-x-4">
              <div className="relative group">
                <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-lg group-hover:blur-xl transition-all duration-300"></div>
                <div className="relative bg-gradient-to-br from-primary to-primary/80 p-3 rounded-2xl shadow-lg">
                  <FileText className="h-8 w-8 text-primary-foreground" />
                  <Sparkles className="h-4 w-4 text-yellow-300 absolute -top-1 -right-1 animate-pulse" />
                </div>
              </div>
              <div className="space-y-1">
                <h1 className="text-3xl font-bold bg-gradient-to-r from-primary via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  DocuMend
                </h1>
                <p className="text-sm text-muted-foreground font-medium">AI-Powered OCR-to-JSON Parser</p>
              </div>
            </Link>
          </div>
          
          <div className="flex items-center space-x-4">
            <nav className="hidden md:flex items-center space-x-6">
              <Link 
                href="/"
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === "/" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <ScanText className="h-4 w-4" />
                OCR Parser
              </Link>
              <Link 
                href="/summarizer"
                className={`text-sm font-medium transition-colors flex items-center gap-2 ${
                  pathname === "/summarizer" ? "text-primary" : "text-muted-foreground hover:text-primary"
                }`}
              >
                <FileText className="h-4 w-4" />
                PDF Summarizer
              </Link>
            </nav>
            
            <div className="hidden lg:flex items-center space-x-2">
              <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-100">
                <TrendingUp className="h-3 w-3 mr-1" />
                v2.1
              </Badge>
              <Badge variant="outline" className="border-blue-200 text-blue-700 dark:border-blue-800 dark:text-blue-300">
                <Users className="h-3 w-3 mr-1" />
                10K+ Users
              </Badge>
            </div>
            <ModeToggle />
          </div>
        </div>
      </div>
    </header>
  );
}
