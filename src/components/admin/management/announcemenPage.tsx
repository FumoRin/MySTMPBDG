import { Plus, Search, Calendar } from "lucide-react";

export default function AdminAnnouncementsPage() {
  const announcements = [
    {
      id: 1,
      title: "System Maintenance Notice",
      content: "Scheduled maintenance this weekend...",
      date: "2024-03-15",
      status: "Scheduled",
    },
    // Add more mock data
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcement Management</h1>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
          <Plus size={20} />
          Create Announcement
        </button>
      </div>

      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcements.map((announcement) => (
          <div key={announcement.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm text-gray-500 flex items-center gap-2">
                <Calendar size={16} />
                {announcement.date}
              </span>
              <span
                className={`px-2 py-1 rounded-full text-xs ${
                  announcement.status === "Scheduled"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {announcement.status}
              </span>
            </div>
            <h3 className="font-semibold mb-2">{announcement.title}</h3>
            <p className="text-gray-600 text-sm">{announcement.content}</p>
            <div className="mt-4 flex gap-2">
              <button className="text-blue-500 text-sm">Edit</button>
              <button className="text-red-500 text-sm">Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
