import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const daysOfWeek = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"];

const scheduleData = [
  {
    subject: "Mathematics",
    time: "08:00 - 09:30",
    teacher: "Mr. Johnson",
    status: "Scheduled",
  },
  {
    subject: "English",
    time: "09:45 - 11:15",
    teacher: "Ms. Smith",
    status: "In Progress",
  },
  {
    subject: "Science",
    time: "11:30 - 13:00",
    teacher: "Dr. Brown",
    status: "Completed",
  },
  {
    subject: "History",
    time: "14:00 - 15:30",
    teacher: "Mrs. Davis",
    status: "Scheduled",
  },
  {
    subject: "Physical Education",
    time: "15:45 - 17:15",
    teacher: "Coach Wilson",
    status: "Canceled",
  },
];

const SchedulePage = () => {
  const [currentDay, setCurrentDay] = useState(0);

  const handlePrevDay = () => {
    setCurrentDay((prev) => (prev > 0 ? prev - 1 : 4));
  };

  const handleNextDay = () => {
    setCurrentDay((prev) => (prev < 4 ? prev + 1 : 0));
  };

  return (
    <div className="schedule-page mt-5 mx-5">
      <h1 className="text-center text-3xl font-bold">Jadwal Pelajaran</h1>
      <div className="container mx-auto p-4">
        <h1 className="text-2xl font-bold mb-4">
          School Schedule - {daysOfWeek[currentDay]}
        </h1>
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-300">
            <thead>
              <tr className="bg-gray-200">
                <th className="py-2 px-4 border border-gray-300">Subject</th>
                <th className="py-2 px-4 border border-gray-300">Time</th>
                <th className="py-2 px-4 border border-gray-300">Teacher</th>
                <th className="py-2 px-4 border border-gray-300">Status</th>
              </tr>
            </thead>
            <tbody>
              {scheduleData.map((item, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <td className="py-2 px-4 border border-gray-300">
                    {item.subject}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.time}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    {item.teacher}
                  </td>
                  <td className="py-2 px-4 border border-gray-300">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold
                    ${
                      item.status === "Scheduled"
                        ? "bg-blue-100 text-blue-800"
                        : item.status === "In Progress"
                        ? "bg-yellow-100 text-yellow-800"
                        : item.status === "Completed"
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                    >
                      {item.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={handlePrevDay}
            className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <ChevronLeft size={20} />
            <span className="ml-2">Previous</span>
          </button>
          <div className="flex space-x-2">
            {daysOfWeek.map((day, index) => (
              <button
                key={day}
                onClick={() => setCurrentDay(index)}
                className={`px-3 py-1 rounded-md ${
                  currentDay === index
                    ? "bg-blue-500 text-white"
                    : "bg-gray-200 hover:bg-gray-300"
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
          <button
            onClick={handleNextDay}
            className="flex items-center px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300"
          >
            <span className="mr-2">Next</span>
            <ChevronRight size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default SchedulePage;
