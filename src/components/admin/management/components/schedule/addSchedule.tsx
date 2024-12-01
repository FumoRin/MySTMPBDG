import React, { Fragment, useState } from "react";
import {
  Schedule,
  DayOfWeek,
  SessionType,
  Semester,
} from "../../../../../context/scheduleTypes";
import toast from "react-hot-toast";
import { Transition } from "@headlessui/react";

interface AddScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  onScheduleAdd: (schedule: Schedule) => void;
}

const AddScheduleModal: React.FC<AddScheduleModalProps> = ({
  isOpen,
  onClose,
  onScheduleAdd,
}) => {
  const [newSchedule, setNewSchedule] = useState<Omit<Schedule, "_id">>({
    class_name: "",
    subject: "",
    teacher: "",
    day_of_week: "Monday",
    time_slot: {
      start_time: "",
      end_time: "",
    },
    room: "",
    session_type: "general",
    semester: "1",
    academic_year: "",
  });

  const daysOfWeek: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const sessionTypes: SessionType[] = ["general", "vocational", "P5"];
  const semesters: Semester[] = ["1", "2"];

  const handleInputChange = (
    field: keyof Omit<Schedule, "_id" | "time_slot">,
    value: string
  ) => {
    setNewSchedule((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleTimeSlotChange = (
    field: "start_time" | "end_time",
    value: string
  ) => {
    setNewSchedule((prev) => ({
      ...prev,
      time_slot: {
        ...prev.time_slot,
        [field]: value,
      },
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validate all fields are filled
    const hasEmptyFields = Object.values(newSchedule).some(
      (value) =>
        value === "" ||
        (typeof value === "object" &&
          Object.values(value).some((v) => v === ""))
    );

    if (hasEmptyFields) {
      toast.error("Please fill in all required fields");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://localhost:3000/api/schedule", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newSchedule),
      });

      if (!response.ok) {
        throw new Error("Failed to create schedule");
      }

      const createdSchedule = await response.json();
      onScheduleAdd(createdSchedule);
      toast.success("Schedule created successfully");
      onClose();
      resetForm();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Failed to create schedule"
      );
    }
  };

  const resetForm = () => {
    setNewSchedule({
      class_name: "",
      subject: "",
      teacher: "",
      day_of_week: "Monday",
      time_slot: {
        start_time: "",
        end_time: "",
      },
      room: "",
      session_type: "general",
      semester: "1",
      academic_year: "",
    });
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="ease-in duration-200"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        <div
          className="fixed inset-0 bg-black/50 z-40"
          aria-hidden="true"
          onClick={onClose}
        >
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className="bg-white rounded-lg p-6 w-full max-w-4xl"
                onClick={(e) => e.stopPropagation()}
              >
                <h2 className="text-2xl font-bold mb-4">Create New Schedule</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Class Name
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.class_name}
                        onChange={(e) =>
                          handleInputChange("class_name", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Subject
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.subject}
                        onChange={(e) =>
                          handleInputChange("subject", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Teacher
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.teacher}
                        onChange={(e) =>
                          handleInputChange("teacher", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Day of Week
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.day_of_week}
                        onChange={(e) =>
                          handleInputChange(
                            "day_of_week",
                            e.target.value as DayOfWeek
                          )
                        }
                      >
                        {daysOfWeek.map((day) => (
                          <option key={day} value={day}>
                            {day}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Start Time
                      </label>
                      <input
                        type="time"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.time_slot.start_time}
                        onChange={(e) =>
                          handleTimeSlotChange("start_time", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        End Time
                      </label>
                      <input
                        type="time"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.time_slot.end_time}
                        onChange={(e) =>
                          handleTimeSlotChange("end_time", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Room
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.room}
                        onChange={(e) =>
                          handleInputChange("room", e.target.value)
                        }
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Session Type
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.session_type}
                        onChange={(e) =>
                          handleInputChange(
                            "session_type",
                            e.target.value as SessionType
                          )
                        }
                      >
                        {sessionTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Semester
                      </label>
                      <select
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.semester}
                        onChange={(e) =>
                          handleInputChange(
                            "semester",
                            e.target.value as Semester
                          )
                        }
                      >
                        {semesters.map((semester) => (
                          <option key={semester} value={semester}>
                            {semester}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Academic Year
                      </label>
                      <input
                        type="text"
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        value={newSchedule.academic_year}
                        onChange={(e) =>
                          handleInputChange("academic_year", e.target.value)
                        }
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 mt-6">
                    <button
                      type="button"
                      onClick={onClose}
                      className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Create Schedule
                    </button>
                  </div>
                </form>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default AddScheduleModal;
