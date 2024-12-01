import React, { Fragment } from "react";
import { Transition } from "@headlessui/react";
import { DayOfWeek, SessionType } from "../../../../../context/scheduleTypes";
import { X } from "lucide-react";

interface FilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: {
    dayOfWeek: DayOfWeek | "";
    sessionType: SessionType | "";
    academicYear: string;
  };
  onFilterChange: (
    field: "dayOfWeek" | "sessionType" | "academicYear",
    value: string
  ) => void;
  onClearFilters: () => void;
}

const ScheduleFilterModal: React.FC<FilterModalProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onClearFilters,
}) => {
  const daysOfWeek: DayOfWeek[] = [
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
  ];
  const sessionTypes: SessionType[] = ["general", "vocational", "P5"];
  const academicYears = ["2024/2025", "2025/2026"];

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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <div
              className="bg-white rounded-lg p-6 w-full max-w-md"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold">Filter Schedules</h2>
                <button
                  onClick={onClose}
                  className="text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Day of Week
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filters.dayOfWeek}
                    onChange={(e) =>
                      onFilterChange("dayOfWeek", e.target.value)
                    }
                  >
                    <option value="">All Days</option>
                    {daysOfWeek.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Session Type
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filters.sessionType}
                    onChange={(e) =>
                      onFilterChange("sessionType", e.target.value)
                    }
                  >
                    <option value="">All Session Types</option>
                    {sessionTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Academic Year
                  </label>
                  <select
                    className="w-full p-2 border rounded-md"
                    value={filters.academicYear}
                    onChange={(e) =>
                      onFilterChange("academicYear", e.target.value)
                    }
                  >
                    <option value="">All Academic Years</option>
                    {academicYears.map((year) => (
                      <option key={year} value={year}>
                        {year}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-between mt-8">
                <button
                  onClick={onClearFilters}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Clear Filters
                </button>
                <button
                  onClick={onClose}
                  className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Apply Filters
                </button>
              </div>
            </div>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default ScheduleFilterModal;
