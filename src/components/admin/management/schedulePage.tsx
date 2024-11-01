import { Plus, Calendar, Clock, Users } from "lucide-react";

export default function AdminSchedulePage() {
  const schedules = [
    {
      id: 1,
      subject: "Mathematics",
      teacher: "John Doe",
      time: "08:00 - 09:30",
      day: "Monday",
      room: "Room 101",
    },
    // Add more mock data
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Schedule Management</h1>
        <button className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg">
          <Plus size={20} />
          Add Schedule
        </button>
      </div>

      {/* Schedule Filter */}
      <div className="flex gap-4 mb-6">
        <select className="border rounded-lg px-4 py-2">
          <option>All Days</option>
          <option>Monday</option>
          <option>Tuesday</option>
          {/* Add other days */}
        </select>
        <select className="border rounded-lg px-4 py-2">
          <option>All Teachers</option>
          {/* Add teacher options */}
        </select>
      </div>

      {/* Schedule Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {schedules.map((schedule) => (
          <div key={schedule.id} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center gap-2 text-blue-500 font-semibold mb-4">
              <Calendar size={20} />
              {schedule.day}
            </div>
            <h3 className="font-semibold text-lg mb-2">{schedule.subject}</h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-600">
                <Users size={16} />
                {schedule.teacher}
              </div>
              <div className="flex items-center gap-2 text-gray-600">
                <Clock size={16} />
                {schedule.time}
              </div>
              <div className="text-gray-600">Room: {schedule.room}</div>
            </div>
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
