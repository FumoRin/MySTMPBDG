import { useState, useEffect } from "react";
import toast from "react-hot-toast";
import {
  Calendar,
  User,
  UsersRound,
  School,
  MoreVertical,
  BookOpen,
  Clock7,
  Filter,
} from "lucide-react";
import {
  Schedule,
  SessionType,
  DayOfWeek,
} from "../../../context/scheduleTypes";
import ScheduleOptionsModal from "./components/schedule/scheduleOptionModal";
import AddScheduleModal from "./components/schedule/addSchedule";
import ModifyScheduleModal from "./components/schedule/scheduleModifyModal";
import ScheduleFilterModal from "./components/schedule/scheduleFilterModal";
import ScheduleDeleteModal from "./components/schedule/scheduleDeleteModal";

const ScheduleManagementPage = () => {
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [schedules, setSchedules] = useState<Schedule[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(
    null
  );
  const [modalPosition, setModalPosition] = useState({ top: 0, left: 0 });
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  const [filters, setFilters] = useState({
    className: "",
    subject: "",
    teacher: "",
    dayOfWeek: "" as DayOfWeek | "",
    sessionType: "" as SessionType | "",
    academicYear: "",
  });

  useEffect(() => {
    const fetchSchedule = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        toast.error("Please log in to access this page");
        return;
      }

      try {
        const response = await fetch("http://localhost:3000/api/schedule", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        if (!response.ok) {
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again");
          } else if (response.status === 403) {
            throw new Error("Forbidden: You do not have permission");
          } else {
            throw new Error("Failed to fetch schedules");
          }
        }

        const data = await response.json();
        const validatedSchedules = data.map((schedule: any) => ({
          ...schedule,
          time_slot: schedule.time_slot || { start_time: "", end_time: "" },
        }));
        setSchedules(validatedSchedules);
      } catch (error) {
        setError(error instanceof Error ? error.message : "An error occurred");
        toast.error(
          error instanceof Error ? error.message : "An error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchSchedule();
  }, []);

  const filteredSchedules = schedules.filter(
    (schedule) =>
      (!filters.subject ||
        schedule.subject
          .toLowerCase()
          .includes(filters.subject.toLowerCase())) &&
      (!filters.teacher ||
        schedule.teacher
          .toLowerCase()
          .includes(filters.teacher.toLowerCase())) &&
      (!filters.dayOfWeek || schedule.day_of_week === filters.dayOfWeek) &&
      (!filters.sessionType || schedule.session_type === filters.sessionType) &&
      (!filters.academicYear || schedule.academic_year === filters.academicYear)
  );

  const handleOpenModal = (schedule: Schedule, event: React.MouseEvent) => {
    event.stopPropagation();
    const rect = event.currentTarget.getBoundingClientRect();
    setModalPosition({
      top: rect.bottom + window.scrollY,
      left: rect.right + window.scrollX,
    });
    setSelectedSchedule(schedule);
    setIsModalOpen(true);
  };

  const handleEdit = () => {
    setIsModifyModalOpen(true);
    setIsModalOpen(false);
  };

  const handleDelete = () => {
    setIsDeleteModalOpen(true);
    setIsModalOpen(false);
  };

  const handleScheduleAdd = (newSchedule: Schedule) => {
    setSchedules([...schedules, newSchedule]);
  };

  const handleScheduleUpdate = (updatedSchedule: Schedule) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule._id === updatedSchedule._id ? updatedSchedule : schedule
      )
    );
  };

  const handleScheduleDelete = (scheduleId: string) => {
    setSchedules(schedules.filter((schedule) => schedule._id !== scheduleId));
  };

  const handleClearFilters = () => {
    setFilters((prev) => ({
      ...prev,
      dayOfWeek: "",
      sessionType: "",
      academicYear: "",
    }));
  };

  return (
    <div className="container mx-auto p-6 bg-gray-50 h-full min-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">
          Schedule Management
        </h1>
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center"
          onClick={() => setIsAddModalOpen(true)}
        >
          <Calendar className="mr-2" size={20} /> Create New Schedule
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg p-4 mb-6">
        <div className="grid grid-cols-1 md:grid-cols-[1fr_1fr_auto] gap-4">
          <div className="relative">
            <input
              type="text"
              placeholder="Subject"
              className="w-full p-2 pl-8 border rounded-md"
              value={filters.subject}
              onChange={(e) =>
                setFilters({ ...filters, subject: e.target.value })
              }
            />
            <School className="absolute left-2 top-3 text-gray-400" size={20} />
          </div>
          <div className="relative">
            <input
              type="text"
              placeholder="Teacher"
              className="w-full p-2 pl-8 border rounded-md"
              value={filters.teacher}
              onChange={(e) =>
                setFilters({ ...filters, teacher: e.target.value })
              }
            />
            <User className="absolute left-2 top-3 text-gray-400" size={20} />
          </div>
          <button
            onClick={() => setIsFilterModalOpen(true)}
            className="flex items-center justify-center gap-1 px-4 py-1.5 border rounded-md hover:bg-gray-50 w-fit"
          >
            <Filter size={20} />
            {filters.dayOfWeek ||
            filters.sessionType ||
            filters.academicYear ? (
              <span className="text-blue-600 font-medium">Filters</span>
            ) : (
              <span>Filters</span>
            )}
          </button>
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-gray-500 text-xl">Loading schedules...</p>
        </div>
      ) : error ? (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-red-500 text-xl">{error}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredSchedules.map((schedule) => (
            <div
              key={schedule._id}
              className="bg-white shadow-md rounded-lg p-5 hover:shadow-lg transition-shadow"
            >
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold text-gray-800">
                  {schedule.subject}
                </h2>
                <div className="relative">
                  <button
                    className="text-gray-500 hover:bg-gray-100 rounded-full p-1"
                    onClick={(e) => handleOpenModal(schedule, e)}
                  >
                    <MoreVertical size={20} />
                  </button>
                </div>
              </div>
              <div className="space-y-2 text-gray-600">
                <div className="flex items-center">
                  <User className="mr-2 text-gray-500" size={16} />
                  <span>{schedule.teacher}</span>
                </div>
                <div className="flex items-center">
                  <UsersRound className="mr-2 text-gray-500" size={16} />
                  <span>{schedule.class_name}</span>
                </div>
                <div className="flex items-center">
                  <Calendar className="mr-2 text-gray-500" size={16} />
                  <span>{schedule.day_of_week}</span>
                </div>
                <div className="flex items-center">
                  <Clock7 className="mr-2 text-gray-500" size={16} />
                  <span>
                    {schedule.time_slot?.start_time || "N/A"} -{" "}
                    {schedule.time_slot?.end_time || "N/A"}
                  </span>
                </div>
                <div className="flex items-center">
                  <School className="mr-2 text-gray-500" size={16} />
                  <span>{schedule.room}</span>
                </div>
                <div className="flex items-center">
                  <BookOpen className="mr-2 text-gray-500" size={16} />
                  <span>{schedule.session_type} Session</span>
                </div>
                <div className="flex items-center">
                  <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm mr-2">
                    Semester {schedule.semester}
                  </span>
                  <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-sm">
                    {schedule.academic_year}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {!isLoading && !error && filteredSchedules.length === 0 && (
        <div className="text-center py-10 bg-white rounded-lg shadow-md">
          <p className="text-gray-500 text-xl">No schedules found</p>
          <p className="text-gray-400 mt-2">Try adjusting your filters</p>
        </div>
      )}

      {selectedSchedule && (
        <ScheduleOptionsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onEdit={handleEdit}
          onDelete={handleDelete}
          position={modalPosition}
        />
      )}

      <AddScheduleModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onScheduleAdd={handleScheduleAdd}
      />

      {selectedSchedule && (
        <ModifyScheduleModal
          isOpen={isModifyModalOpen}
          onClose={() => setIsModifyModalOpen(false)}
          onScheduleUpdate={handleScheduleUpdate}
          schedule={selectedSchedule}
        />
      )}

      <ScheduleFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        filters={{
          dayOfWeek: filters.dayOfWeek,
          sessionType: filters.sessionType,
          academicYear: filters.academicYear,
        }}
        onFilterChange={(field, value) =>
          setFilters((prev) => ({ ...prev, [field]: value }))
        }
        onClearFilters={handleClearFilters}
      />

      {selectedSchedule && (
        <ScheduleDeleteModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          schedule={selectedSchedule}
          onScheduleDeleted={handleScheduleDelete}
        />
      )}
    </div>
  );
};

export default ScheduleManagementPage;
