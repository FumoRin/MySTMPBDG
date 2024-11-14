import React, { useState, useEffect, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { Eye, EyeOff, UserPlus } from "lucide-react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: "sysadmin" | "teacher" | "student";
  student_info?: {
    department: string;
    generation: number;
    class: string;
  };
  teacher_info?: {
    department: string;
    subjects: string[];
  };
  password?: string;
}

interface UserModifyModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onUserUpdated: (updatedUser: User) => void;
}

export default function UserModifyModal({
  isOpen,
  onClose,
  user,
  onUserUpdated,
}: UserModifyModalProps) {
  const [modifiedUser, setModifiedUser] = useState<User>({ ...user });
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setModifiedUser({ ...user });
      setError(null);
    }
  }, [isOpen, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const loadingToast = toast.loading("Updating user...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      const response = await fetch(
        `http://localhost:3000/api/users/${user._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(modifiedUser),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update user");
      }

      const updatedUser: User = await response.json();
      toast.dismiss(loadingToast);
      toast.success("User updated successfully");
      onUserUpdated(updatedUser);
      onClose();
    } catch (err) {
      toast.dismiss(loadingToast);
      const errorMessage =
        err instanceof Error ? err.message : "An unexpected error occurred";
      toast.error(errorMessage);
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
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
                  className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Modify User</h2>
                    <button
                      onClick={onClose}
                      className="text-gray-500 hover:text-gray-700"
                    >
                      <UserPlus size={20} />
                    </button>
                  </div>
                  <form onSubmit={handleSubmit}>
                    {error && (
                      <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                        {error}
                      </div>
                    )}
                    <div className="space-y-4">
                      {/* Username Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Username
                        </label>
                        <input
                          type="text"
                          value={modifiedUser.username}
                          onChange={(e) =>
                            setModifiedUser({
                              ...modifiedUser,
                              username: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          required
                        />
                      </div>

                      {/* Password Field */}
                      <div className="relative">
                        <label className="block text-sm font-medium text-gray-700">
                          Password
                        </label>
                        <input
                          type={showPassword ? "text" : "password"}
                          value={modifiedUser.password || ""}
                          onChange={(e) =>
                            setModifiedUser({
                              ...modifiedUser,
                              password: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-2 top-[70%] transform -translate-y-1/2"
                        >
                          {showPassword ? (
                            <EyeOff size={20} />
                          ) : (
                            <Eye size={20} />
                          )}
                        </button>
                      </div>

                      {/* Email Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Email
                        </label>
                        <input
                          type="email"
                          value={modifiedUser.email}
                          onChange={(e) =>
                            setModifiedUser({
                              ...modifiedUser,
                              email: e.target.value,
                            })
                          }
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                          required
                        />
                      </div>

                      {/* Role Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700">
                          Role
                        </label>
                        <select
                          value={modifiedUser.role}
                          onChange={(e) => {
                            const selectedRole = e.target.value as User["role"];
                            setModifiedUser({
                              ...modifiedUser,
                              role: selectedRole,
                              student_info:
                                selectedRole === "student"
                                  ? { department: "", generation: 0, class: "" }
                                  : undefined,
                              teacher_info:
                                selectedRole === "teacher"
                                  ? { department: "", subjects: [""] }
                                  : undefined,
                            });
                          }}
                          className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        >
                          <option value="student">Student</option>
                          <option value="teacher">Teacher</option>
                          <option value="sysadmin">Sysadmin</option>
                        </select>
                      </div>
                    </div>

                    {/* Students Info */}
                    {modifiedUser.role === "student" && (
                      <div className="mb-4 pt-4">
                        <h3 className="text-md font-semibold text-gray-700">
                          Student Information
                        </h3>
                        <div className="mb-2 pt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Department
                          </label>
                          <input
                            type="text"
                            value={modifiedUser.student_info?.department}
                            onChange={(e) =>
                              setModifiedUser({
                                ...modifiedUser,
                                student_info: {
                                  ...modifiedUser.student_info,
                                  department: e.target.value,
                                  generation:
                                    modifiedUser.student_info?.generation || 0,
                                  class: modifiedUser.student_info?.class || "",
                                },
                              })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Year of Enrollment
                          </label>
                          <input
                            type="number"
                            value={modifiedUser.student_info?.generation}
                            onChange={(e) =>
                              setModifiedUser({
                                ...modifiedUser,
                                student_info: {
                                  ...modifiedUser.student_info,
                                  generation: parseInt(e.target.value),
                                  department:
                                    modifiedUser.student_info?.department || "",
                                  class: modifiedUser.student_info?.class || "",
                                },
                              })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Class
                          </label>
                          <input
                            type="text"
                            value={modifiedUser.student_info?.class}
                            onChange={(e) =>
                              setModifiedUser({
                                ...modifiedUser,
                                student_info: {
                                  ...modifiedUser.student_info,
                                  class: e.target.value,
                                  department:
                                    modifiedUser.student_info?.department || "",
                                  generation:
                                    modifiedUser.student_info?.generation || 0,
                                },
                              })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Teacher Info */}
                    {modifiedUser.role === "teacher" && (
                      <div className="mb-4 pt-4">
                        <h3 className="text-md font-semibold text-gray-700">
                          Teacher Information
                        </h3>
                        <div className="mb-2 pt-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Department
                          </label>
                          <input
                            type="text"
                            value={modifiedUser.teacher_info?.department}
                            onChange={(e) =>
                              setModifiedUser({
                                ...modifiedUser,
                                teacher_info: {
                                  ...modifiedUser.teacher_info,
                                  department: e.target.value,
                                  subjects:
                                    modifiedUser.teacher_info?.subjects || [],
                                },
                              })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            required
                          />
                        </div>
                        <div className="mb-2">
                          <label className="block text-sm font-medium text-gray-700">
                            Subjects
                          </label>
                          <input
                            type="text"
                            value={
                              modifiedUser.teacher_info?.subjects?.join(", ") ||
                              ""
                            }
                            onChange={(e) =>
                              setModifiedUser({
                                ...modifiedUser,
                                teacher_info: {
                                  ...modifiedUser.teacher_info,
                                  department:
                                    modifiedUser.teacher_info?.department || "",
                                  subjects: e.target.value
                                    .split(",")
                                    .map((subject) => subject.trim()),
                                },
                              })
                            }
                            className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                            placeholder="Comma separated subjects"
                            required
                          />
                        </div>
                      </div>
                    )}

                    {/* Form Buttons */}
                    <div className="mt-6 flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={onClose}
                        className="px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-md"
                        disabled={isLoading}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                        disabled={isLoading}
                      >
                        {isLoading ? "Updating ..." : "Update"}
                      </button>
                    </div>
                  </form>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Transition.Child>
      </div>
    </Transition>
  );
}
