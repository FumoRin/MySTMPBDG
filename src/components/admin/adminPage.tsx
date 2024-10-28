import { Users, Bell, Calendar, Activity, UserCheck } from "lucide-react";

export default function AdminPage() {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      {/* User Management Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <DashboardCard
          icon={<Users className="w-6 h-6" />}
          title="User Management"
          value="534"
          label="Total Users"
        />
        <DashboardCard
          icon={<UserCheck className="w-6 h-6" />}
          title="Online Users"
          value="127"
          label="Currently Active"
        />
        <DashboardCard
          icon={<Activity className="w-6 h-6" />}
          title="User Activity"
          value="2.3k"
          label="Actions Today"
        />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Announcements Panel */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Bell className="w-5 h-5" />
            Announcements
          </h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-500 text-white p-2 rounded">
              Create New Announcement
            </button>
            <div className="border rounded p-4">
              <h3 className="font-medium">Recent Announcements</h3>
              {/* Placeholder for announcement list */}
              <div className="text-sm text-gray-500 mt-2">
                No recent announcements
              </div>
            </div>
          </div>
        </div>

        {/* Schedule Management */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Schedule Management
          </h2>
          <div className="space-y-4">
            <button className="w-full bg-blue-500 text-white p-2 rounded">
              Modify Schedule
            </button>
            <div className="border rounded p-4">
              <h3 className="font-medium">Schedule Overview</h3>
              {/* Placeholder for schedule summary */}
              <div className="text-sm text-gray-500 mt-2">
                No active schedules
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Dashboard Card Component
function DashboardCard({
  icon,
  title,
  value,
  label,
}: {
  icon: React.ReactNode;
  title: string;
  value: string;
  label: string;
}) {
  return (
    <div className="bg-white p-6 rounded-lg shadow">
      <div className="flex items-center justify-between mb-4">
        <h3 className="font-semibold">{title}</h3>
        {icon}
      </div>
      <div className="text-3xl font-bold mb-1">{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}
