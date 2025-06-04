import { DashboardLayout } from "@/components/dashboard/layout";
import { Overview } from "@/components/dashboard/overview";
import { RecentActivity } from "@/components/dashboard/recent-activity";
import { Stats } from "@/components/dashboard/stats";
import { PerformanceChart } from "@/components/dashboard/performance-chart";
import { UserWelcome } from "@/components/dashboard/user-welcome";

export default function Home() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8">
        <UserWelcome />
        <Stats />
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
          <Overview className="md:col-span-2 lg:col-span-4" />
          <PerformanceChart className="md:col-span-2 lg:col-span-3" />
        </div>
        <RecentActivity />
      </div>
    </DashboardLayout>
  );
}