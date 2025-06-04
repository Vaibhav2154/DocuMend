"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { PlusCircle, ArrowRight } from "lucide-react";

export function UserWelcome() {
  const [greeting, setGreeting] = useState("Good morning");

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      setGreeting("Good morning");
    } else if (hour >= 12 && hour < 18) {
      setGreeting("Good afternoon");
    } else {
      setGreeting("Good evening");
    }
  }, []);

  return (
    <Card className="border-none shadow-none bg-transparent">
      <CardContent className="p-0 space-y-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{greeting}, John</h1>
          <p className="text-muted-foreground">Here's an overview of your dashboard today.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button className="h-9 gap-1">
            <PlusCircle className="h-4 w-4" />
            <span>New Report</span>
          </Button>
          <Button variant="outline" className="h-9 gap-1">
            <span>View All Analytics</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}