'use client';

import { DashboardLayout } from "@/components/dashboard/layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  AreaChart,
  Area,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";

const lineData = [
  { name: "Jan", users: 400, pageViews: 2400 },
  { name: "Feb", users: 500, pageViews: 2600 },
  { name: "Mar", users: 600, pageViews: 3200 },
  { name: "Apr", users: 800, pageViews: 4500 },
  { name: "May", users: 1000, pageViews: 5200 },
  { name: "Jun", users: 1200, pageViews: 6000 },
  { name: "Jul", users: 1400, pageViews: 6800 },
];

const areaData = [
  { name: "Jan", mobile: 4000, desktop: 2400, tablet: 1600 },
  { name: "Feb", mobile: 4500, desktop: 2800, tablet: 1800 },
  { name: "Mar", mobile: 5000, desktop: 3200, tablet: 2000 },
  { name: "Apr", mobile: 5500, desktop: 3600, tablet: 2200 },
  { name: "May", mobile: 5200, desktop: 3800, tablet: 2400 },
  { name: "Jun", mobile: 5800, desktop: 4200, tablet: 2600 },
  { name: "Jul", mobile: 6200, desktop: 4600, tablet: 2800 },
];

const pieData = [
  { name: "Chrome", value: 55 },
  { name: "Safari", value: 20 },
  { name: "Firefox", value: 15 },
  { name: "Edge", value: 8 },
  { name: "Others", value: 2 },
];

const COLORS = ["hsl(var(--chart-1))", "hsl(var(--chart-2))", "hsl(var(--chart-3))", "hsl(var(--chart-4))", "hsl(var(--chart-5))"];

export default function AnalyticsPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Analytics</h1>
          <p className="text-muted-foreground mt-2">
            Detailed analytics and statistics for your platform.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>User Engagement</CardTitle>
              <CardDescription>
                Users and page views over time
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={lineData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="pageViews" stroke="hsl(var(--chart-1))" strokeWidth={2} activeDot={{ r: 8 }} />
                  <Line type="monotone" dataKey="users" stroke="hsl(var(--chart-2))" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <Card className="col-span-2">
            <CardHeader>
              <CardTitle>Device Distribution</CardTitle>
              <CardDescription>
                Traffic by device type
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={areaData} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                  <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" />
                  <YAxis stroke="hsl(var(--muted-foreground))" />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                  <Legend />
                  <Area type="monotone" dataKey="mobile" stackId="1" stroke="hsl(var(--chart-1))" fill="hsl(var(--chart-1))" fillOpacity={0.7} />
                  <Area type="monotone" dataKey="desktop" stackId="1" stroke="hsl(var(--chart-2))" fill="hsl(var(--chart-2))" fillOpacity={0.7} />
                  <Area type="monotone" dataKey="tablet" stackId="1" stroke="hsl(var(--chart-3))" fill="hsl(var(--chart-3))" fillOpacity={0.7} />
                </AreaChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Browser Share</CardTitle>
              <CardDescription>
                Most used browsers
              </CardDescription>
            </CardHeader>
            <CardContent className="h-[300px] flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={pieData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{
                      backgroundColor: "hsl(var(--background))",
                      borderColor: "hsl(var(--border))",
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </div>
      </div>
    </DashboardLayout>
  );
}