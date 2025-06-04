"use client";

import { useState } from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { 
  LayoutGrid, 
  List, 
  Clock, 
  MoreHorizontal, 
  ArrowUpRight, 
  ArrowDownLeft,
  User,
  AlertCircle
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const activities = [
  {
    id: 1,
    type: "transaction",
    title: "Payment received",
    description: "Payment received from John Smith",
    timestamp: "Just now",
    amount: "$2,500.00",
    status: "success",
    icon: ArrowUpRight,
  },
  {
    id: 2,
    type: "user",
    title: "New user signed up",
    description: "Emily Johnson created an account",
    timestamp: "2 hours ago",
    avatar: "https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg",
    initials: "EJ",
    icon: User,
  },
  {
    id: 3,
    type: "transaction",
    title: "Payment sent",
    description: "Subscription renewal for Premium Plan",
    timestamp: "5 hours ago",
    amount: "$59.99",
    status: "pending",
    icon: ArrowDownLeft,
  },
  {
    id: 4,
    type: "alert",
    title: "Security alert",
    description: "Unusual login attempt detected",
    timestamp: "Yesterday, 11:32 PM",
    priority: "high",
    icon: AlertCircle,
  },
  {
    id: 5,
    type: "user",
    title: "Profile updated",
    description: "Michael Brown updated profile information",
    timestamp: "Yesterday, 9:25 AM",
    avatar: "https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg",
    initials: "MB",
    icon: User,
  },
];

export function RecentActivity() {
  const [view, setView] = useState<"grid" | "list">("list");

  return (
    <Card>
      <CardHeader className="flex flex-row items-center">
        <div className="space-y-1.5">
          <CardTitle>Recent Activity</CardTitle>
          <CardDescription>
            Your latest transactions and events.
          </CardDescription>
        </div>
        <div className="ml-auto flex gap-2">
          <Tabs defaultValue="all" className="w-[250px]">
            <TabsList className="h-8">
              <TabsTrigger value="all" className="text-xs">All</TabsTrigger>
              <TabsTrigger value="transactions" className="text-xs">Transactions</TabsTrigger>
              <TabsTrigger value="users" className="text-xs">Users</TabsTrigger>
            </TabsList>
          </Tabs>
          <div className="flex items-center rounded-md border">
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                view === "list" && "bg-muted"
              )}
              onClick={() => setView("list")}
            >
              <List className="h-4 w-4" />
              <span className="sr-only">List view</span>
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className={cn(
                "h-8 w-8",
                view === "grid" && "bg-muted"
              )}
              onClick={() => setView("grid")}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="sr-only">Grid view</span>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className={view === "grid" ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4" : "space-y-4"}>
          {activities.map((activity) => (
            <div
              key={activity.id}
              className={cn(
                "rounded-lg border p-4 transition-all hover:bg-accent/50",
                view === "list" && "flex items-start space-x-4"
              )}
            >
              <div className={cn(
                "rounded-full p-2 mr-3",
                activity.type === "transaction" && activity.status === "success" ? "bg-green-100 dark:bg-green-900/20" : 
                activity.type === "transaction" && activity.status === "pending" ? "bg-yellow-100 dark:bg-yellow-900/20" :
                activity.type === "alert" ? "bg-red-100 dark:bg-red-900/20" :
                "bg-blue-100 dark:bg-blue-900/20"
              )}>
                <activity.icon className={cn(
                  "h-4 w-4",
                  activity.type === "transaction" && activity.status === "success" ? "text-green-600 dark:text-green-400" : 
                  activity.type === "transaction" && activity.status === "pending" ? "text-yellow-600 dark:text-yellow-400" :
                  activity.type === "alert" ? "text-red-600 dark:text-red-400" :
                  "text-blue-600 dark:text-blue-400"
                )} />
              </div>
              <div className="flex flex-1 flex-col space-y-1">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-medium">{activity.title}</p>
                  {activity.type === "transaction" && (
                    <Badge variant={activity.status === "success" ? "success" : "outline"} className="ml-auto">
                      {activity.status === "success" ? "Completed" : "Pending"}
                    </Badge>
                  )}
                  {activity.type === "alert" && (
                    <Badge variant="destructive" className="ml-auto">
                      High Priority
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground">
                  {activity.description}
                </p>
                <div className="flex items-center pt-2">
                  {activity.type === "user" && (
                    <Avatar className="h-6 w-6 mr-2">
                      {activity.avatar && (
                        <AvatarImage src={activity.avatar} alt="User" />
                      )}
                      <AvatarFallback>{activity.initials}</AvatarFallback>
                    </Avatar>
                  )}
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="mr-1 h-3 w-3" />
                    {activity.timestamp}
                  </div>
                  {activity.type === "transaction" && (
                    <div className="ml-auto text-sm font-medium">
                      {activity.amount}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
      <CardFooter>
        <Button variant="outline" className="w-full">
          View all activity
        </Button>
      </CardFooter>
    </Card>
  );
}