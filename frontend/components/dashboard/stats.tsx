import { 
  ArrowDownIcon, 
  ArrowUpIcon, 
  DollarSign, 
  Users, 
  CreditCard, 
  Activity
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const stats = [
  {
    title: "Total Revenue",
    value: "$45,231.89",
    change: "+20.1%",
    increasing: true,
    icon: DollarSign,
  },
  {
    title: "Active Users",
    value: "2,350",
    change: "+12.5%",
    increasing: true,
    icon: Users,
  },
  {
    title: "Transactions",
    value: "4,721",
    change: "+8.2%",
    increasing: true,
    icon: CreditCard,
  },
  {
    title: "Conversion Rate",
    value: "3.2%",
    change: "-2.1%",
    increasing: false,
    icon: Activity,
  },
];

export function Stats() {
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <Card key={index} className="overflow-hidden transition-all duration-200 hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              {stat.title}
            </CardTitle>
            <div className="h-8 w-8 rounded-full bg-muted flex items-center justify-center">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="flex items-center text-xs text-muted-foreground mt-1">
              {stat.increasing ? (
                <ArrowUpIcon className="mr-1 h-4 w-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="mr-1 h-4 w-4 text-red-500" />
              )}
              <span
                className={cn(
                  stat.increasing ? "text-green-500" : "text-red-500"
                )}
              >
                {stat.change}
              </span>
              <span className="ml-1">from last month</span>
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}