"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Legend 
} from 'recharts';
import { useState } from "react";

const data = [
  {
    name: "Mon",
    visitors: 2400,
    conversions: 1200,
  },
  {
    name: "Tue",
    visitors: 3000,
    conversions: 1398,
  },
  {
    name: "Wed",
    visitors: 2000,
    conversions: 800,
  },
  {
    name: "Thu",
    visitors: 2780,
    conversions: 1608,
  },
  {
    name: "Fri",
    visitors: 1890,
    conversions: 1200,
  },
  {
    name: "Sat",
    visitors: 2390,
    conversions: 1400,
  },
  {
    name: "Sun",
    visitors: 3490,
    conversions: 1700,
  },
];

interface PerformanceChartProps {
  className?: string;
}

export function PerformanceChart({ className }: PerformanceChartProps) {
  const [period, setPeriod] = useState("week");

  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Performance</CardTitle>
        <Select defaultValue={period} onValueChange={setPeriod}>
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">This Week</SelectItem>
            <SelectItem value="month">This Month</SelectItem>
            <SelectItem value="year">This Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                dataKey="name" 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
                tickMargin={10} 
              />
              <YAxis 
                stroke="hsl(var(--muted-foreground))" 
                fontSize={12} 
              />
              <Tooltip 
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid gap-1">
                          <p className="text-sm font-medium">{label}</p>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-2))]" />
                            <p className="text-xs">
                              Visitors: {payload[0].value}
                            </p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-[hsl(var(--chart-1))]" />
                            <p className="text-xs">
                              Conversions: {payload[1].value}
                            </p>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Legend />
              <Line 
                type="monotone" 
                dataKey="visitors" 
                stroke="hsl(var(--chart-2))" 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
                activeDot={{ r: 6 }}
              />
              <Line 
                type="monotone" 
                dataKey="conversions" 
                stroke="hsl(var(--chart-1))" 
                strokeWidth={2}
                dot={{ strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}