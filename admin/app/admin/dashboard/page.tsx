// Components
import AdminNotificationList from "./components/AdminNotificationList";
import ThisWeekLineChart from "./components/ThisWeekLineChart";
import RecentActivitiesList from "./components/RecentActivitiesList";
import StatCards from "./components/StatCards";
import ThisMonthLineChart from "./components/ThisMonthLineChart";

export default function DashboardPage() {
  return (
    <div className="overflow-auto">
      {/* Welcome text */}
      <div className="flex gap-4">
        <div className="avatar avatar-online avatar-placeholder">
          <div className="bg-neutral text-neutral-content w-16 rounded-full">
            <span className="text-xl">J</span>
          </div>
        </div>
        <div className="flex flex-col justify-center gap-0">
          <span className="text-[1.4rem]">
            Welcome back, <b>John!</b>
          </span>
          <span className="text-[0.8rem]">Super Admin</span>
        </div>
      </div>

      <StatCards />

      <div className="grid grid-cols-2 gap-3 mt-7">
        {/* Recent Activities Log */}
        <div className="pr-2 h-112 rounded-lg overflow-auto shadow-lg">
          <RecentActivitiesList />
        </div>

        {/* System Notifications */}
        <div className="pr-2 h-112 rounded-lg overflow-auto shadow-lg">
          <AdminNotificationList />
        </div>
      </div>

      {/* This week line chart */}
      <div className="mt-7 h-128 bg-base-100 border-2 border-base-300 rounded-lg overflow-hidden">
        <ThisWeekLineChart />
      </div>
      {/* Past 7 weeks line chart */}
      <div className="mt-7 h-128 bg-base-100 border-2 border-base-300 rounded-lg overflow-hidden">
        <ThisMonthLineChart />
      </div>

      <div className="grid grid-cols-2 gap-3 mt-7">
        <div className="border-2 border-base-300 h-112 rounded-lg overflow-auto"></div>
        <div className="border-2 border-base-300 h-112 rounded-lg overflow-auto"></div>
      </div>
    </div>
  );
}
