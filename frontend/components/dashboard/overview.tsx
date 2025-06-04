"use client";

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const data = [
  {
    name: "Jan",
    total: 1800,
  },
  {
    name: "Feb",
    total: 2200,
  },
  {
    name: "Mar",
    total: 2700,
  },
  {
    name: "Apr",
    total: 2400,
  },
  {
    name: "May",
    total: 3100,
  },
  {
    name: "Jun",
    total: 2900,
  },
  {
    name: "Jul",
    total: 3300,
  },
  {
    name: "Aug",
    total: 3600,
  },
  {
    name: "Sep",
    total: 3200,
  },
  {
    name: "Oct",
    total: 3500,
  },
  {
    name: "Nov",
    total: 3800,
  },
  {
    name: "Dec",
    total: 4200,
  },
];

interface OverviewProps {
  className?: string;
}

export function Overview({ className }: OverviewProps) {
  return (
    <Card className={className}>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Revenue Overview</CardTitle>
        <Select defaultValue="year">
          <SelectTrigger className="w-[120px] h-8">
            <SelectValue placeholder="Select period" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="week">Last Week</SelectItem>
            <SelectItem value="month">Last Month</SelectItem>
            <SelectItem value="year">Last Year</SelectItem>
          </SelectContent>
        </Select>
      </CardHeader>
      <CardContent className="p-0">
        <div className="h-[300px] w-full pt-6">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data}>
              <XAxis
                dataKey="name"
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#888888"
                tickMargin={8}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                fontSize={12}
                stroke="#888888"
                tickFormatter={(value) => `$${value}`}
              />
              <Tooltip 
                cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    return (
                      <div className="rounded-lg border bg-background p-2 shadow-sm">
                        <div className="grid grid-cols-2 gap-2">
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Month
                            </span>
                            <span className="font-bold text-sm">
                              {payload[0].payload.name}
                            </span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[0.70rem] uppercase text-muted-foreground">
                              Revenue
                            </span>
                            <span className="font-bold text-sm">
                              ${payload[0].payload.total.toLocaleString()}
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Bar
                dataKey="total"
                fill="hsl(var(--chart-1))"
                radius={[4, 4, 0, 0]}
                className="transition-all hover:fill-opacity-90"
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}