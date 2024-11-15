import React, { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { X } from "lucide-react";
import { User } from "../../../../context/userTypes";

interface UserFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  users: User[];
  currentFilters: {
    role: string;
    department: string;
    generation: string;
  };
  onApplyFilters: (filters: {
    role: string;
    department: string;
    generation: string;
  }) => void;
}

const UserFilterModal: React.FC<UserFilterModalProps> = ({
  isOpen,
  onClose,
  users,
  currentFilters,
  onApplyFilters,
}) => {
  // Create local state for filters to allow editing before applying
  const [localFilters, setLocalFilters] = useState({
    role: currentFilters.role,
    department: currentFilters.department,
    generation: currentFilters.generation,
  });

  // Helper function to get unique values
  const getUniqueValues = (field: "role" | "department" | "generation") => {
    const uniqueValues = new Set<string>();

    users.forEach((user) => {
      let value: string | undefined;

      switch (field) {
        case "role":
          value = user.role;
          break;
        case "department":
          value =
            user.teacher_info?.department || user.student_info?.department;
          break;
        case "generation":
          value = user.student_info?.generation?.toString();
          break;
      }

      if (value) {
        uniqueValues.add(value);
      }
    });

    return Array.from(uniqueValues).sort();
  };

  // Get unique values
  const uniqueRoles = getUniqueValues("role");
  const uniqueDepartments = getUniqueValues("department");
  const uniqueGenerations = getUniqueValues("generation");

  // Handle filter application
  const handleApplyFilters = () => {
    onApplyFilters(localFilters);
    onClose();
  };

  // Handle filter reset
  const handleResetFilters = () => {
    setLocalFilters({
      role: "",
      department: "",
      generation: "",
    });
    onApplyFilters({
      role: "",
      department: "",
      generation: "",
    });
    onClose();
  };

  // If modal is not open, return null

  return (
    <Transition show={isOpen} as={Fragment}>
      <Transition.Child
        as={Fragment}
        enter="ease-out duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100 "
        leave="ease-in duration-300"
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
              leave="ease-in duration-300"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <div
                className="bg-white rounded-lg shadow-xl w-96 p-6 relative"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Close Button */}
                <button
                  onClick={onClose}
                  className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                  <X size={24} />
                </button>

                <h2 className="text-xl font-bold mb-4">Filter Users</h2>

                {/* Role Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Role
                  </label>
                  <select
                    value={localFilters.role}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        role: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">All Roles</option>
                    {uniqueRoles.map((role) => (
                      <option key={role} value={role}>
                        {role.charAt(0).toUpperCase() + role.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Department Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Department
                  </label>
                  <select
                    value={localFilters.department}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        department: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">All Departments</option>
                    {uniqueDepartments.map((dept) => (
                      <option key={dept} value={dept}>
                        {dept}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Generation Filter */}
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Generation
                  </label>
                  <select
                    value={localFilters.generation}
                    onChange={(e) =>
                      setLocalFilters((prev) => ({
                        ...prev,
                        generation: e.target.value,
                      }))
                    }
                    className="w-full px-3 py-2 border rounded-md"
                  >
                    <option value="">All Generations</option>
                    {uniqueGenerations.map((gen) => (
                      <option key={gen} value={gen}>
                        {gen}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-between mt-6">
                  <button
                    onClick={handleResetFilters}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300"
                  >
                    Reset Filters
                  </button>
                  <button
                    onClick={handleApplyFilters}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
};

export default UserFilterModal;
