"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, X, FileText } from "lucide-react";

export function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <FileText className="h-8 w-8 text-primary" />
          <span className="text-2xl font-bold">DocuMend</span>
        </Link>

        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          <Link href="#features" className="hover:text-primary transition-colors">
            Features
          </Link>
          <Link href="#testimonials" className="hover:text-primary transition-colors">
            Testimonials
          </Link>
          <Link href="#pricing" className="hover:text-primary transition-colors">
            Pricing
          </Link>
        </nav>

        <div className="hidden md:flex items-center space-x-4">
          <Link href="/login">
            <Button variant="ghost">Sign In</Button>
          </Link>
          <Link href="/signup">
            <Button>Get Started</Button>
          </Link>
        </div>

        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="icon">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right">
            <div className="flex flex-col space-y-6 mt-6">
              <Link href="#features" onClick={() => setIsOpen(false)}>
                Features
              </Link>
              <Link href="#testimonials" onClick={() => setIsOpen(false)}>
                Testimonials
              </Link>
              <Link href="#pricing" onClick={() => setIsOpen(false)}>
                Pricing
              </Link>
              <div className="flex flex-col space-y-2 pt-4">
                <Link href="/login">
                  <Button variant="ghost" className="w-full">Sign In</Button>
                </Link>
                <Link href="/signup">
                  <Button className="w-full">Get Started</Button>
                </Link>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
}