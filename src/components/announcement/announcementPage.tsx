import React from "react";
import { Bell, Calendar, Clock, MapPin, MessageSquare } from "lucide-react";

// Define the shape of an announcement
interface Announcement {
  title: string;
  type: "meeting" | "academic" | "event"; // You can expand this type if needed
  date: string;
  time: string;
  location?: string; // Optional property
  description: string;
  author: string;
  role?: string; // Optional property
  priority?: "high"; // Optional property, add more if needed
}

const AnnouncementPage: React.FC = () => {
  const announcements: Announcement[] = [
    {
      title: "School Council Meeting",
      type: "meeting",
      date: "2024-09-28",
      time: "3:00 PM",
      location: "School Auditorium",
      description: "Join us for our monthly school council meeting.",
      author: "John Doe",
      role: "School Council President",
    },
    {
      title: "Mid-Term Exam Schedule Released",
      type: "academic",
      date: "2024-09-30",
      time: "8:00 AM",
      description:
        "Check your exam schedule for next month. Prepare accordingly.",
      author: "Academic Office",
      priority: "high",
    },
    {
      title: "Science Fair Registration",
      type: "event",
      date: "2024-10-05",
      time: "All Day",
      location: "School Hall",
      description: "Register your projects for the annual science fair.",
      author: "Science Department",
    },
  ];

  const getTypeColor = (type: "meeting" | "academic" | "event"): string => {
    const colors = {
      meeting: "bg-blue-100 text-blue-800",
      academic: "bg-red-100 text-red-800",
      event: "bg-green-100 text-green-800",
    };
    return colors[type] || "bg-gray-100 text-gray-800";
  };

  return (
    <div className="w-full bg-white rounded-lg shadow-sm p-6">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold flex items-center gap-2">
          <Bell className="h-5 w-5" />
          Pengumuman
        </h2>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement, index) => (
          <div
            key={index}
            className="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors"
          >
            {/* Announcement Header */}
            <div className="flex justify-between items-start mb-2">
              <div>
                <h3 className="font-semibold text-lg">{announcement.title}</h3>
                <span
                  className={`text-sm px-2 py-1 rounded-full ${getTypeColor(
                    announcement.type
                  )}`}
                >
                  {announcement.type}
                </span>
              </div>
              {announcement.priority === "high" && (
                <span className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                  Important
                </span>
              )}
            </div>

            {/* Description */}
            <p className="text-gray-600 mb-3">{announcement.description}</p>

            {/* Metadata Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-sm text-gray-500">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                {announcement.date}
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                {announcement.time}
              </div>
              {announcement.location && (
                <div className="flex items-center gap-1">
                  <MapPin className="h-4 w-4" />
                  {announcement.location}
                </div>
              )}
              <div className="flex items-center gap-1">
                <MessageSquare className="h-4 w-4" />
                {announcement.author}
                {announcement.role && ` (${announcement.role})`}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementPage;
