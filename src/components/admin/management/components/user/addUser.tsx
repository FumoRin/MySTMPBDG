import { UserPlus } from "lucide-react";
import { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import { EyeOff, Eye } from "lucide-react";
import toast from "react-hot-toast";

type userRole = "sysadmin" | "teacher" | "student";

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (user: UserForm) => void;
}

interface UserForm {
  username: string;
  password: string;
  name: string;
  email: string;
  role: userRole;
  profile: {
    full_name: string;
  };
  student_info?: {
    department?: string;
    generation?: number;
    class?: string;
  };
  teacher_info?: {
    department?: string;
    subjects?: string[];
  };
}

interface ApiResponse {
  message: string;
  user: {
    username: string;
    email: string;
    role: string;
    profile: {
      full_name: string;
    };
  };
}

export default function AddUserModal({
  isOpen,
  onClose,
  onSubmit,
}: UserModalProps) {
  const [error, setError] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [user, setUser] = useState<UserForm>({
    username: "",
    password: "",
    name: "",
    email: "",
    role: "student",
    profile: { full_name: "" },
    student_info: { department: "", generation: 0, class: "" },
    teacher_info: { department: "", subjects: [""] },
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    // Prepare the user data based on role
    const userData = {
      ...user,
      name: user.name || user.username,
      profile: {
        full_name: user.profile.full_name || user.username, // Ensure this is included
      },
      teacher_info:
        user.role === "teacher"
          ? {
              department: user.teacher_info?.department,
              subjects: user.teacher_info?.subjects,
            }
          : {}, // Use an empty object for non-teachers
      student_info:
        user.role === "student"
          ? {
              department: user.student_info?.department,
              class: user.student_info?.class,
              generation: user.student_info?.generation,
            }
          : {}, // Use an empty object for non-students
    };

    const loadingToast = toast.loading("Creating user...");

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create user");
      }

      const data: ApiResponse = await response.json();

      toast.dismiss(loadingToast);
      toast.success("User created successfully!");

      onSubmit({
        username: data.user.username,
        password: userData.password,
        name: data.user.profile.full_name,
        email: data.user.email,
        role: data.user.role as userRole,
        profile: data.user.profile,
        student_info:
          userData.role === "student" ? userData.student_info : undefined,
        teacher_info:
          userData.role === "teacher" ? userData.teacher_info : undefined,
      });

      onClose();

      // Reset form to initial state
      setUser({
        username: "",
        password: "",
        name: "",
        email: "",
        role: "student",
        profile: { full_name: "" },
        student_info: { department: "", generation: 0, class: "" },
        teacher_info: { department: "", subjects: [""] },
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
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
                className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-bold">Create New Users</h2>
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
                        value={user.username}
                        onChange={(e) =>
                          setUser({ ...user, username: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        required
                      />
                    </div>

                    {/* password Field */}
                    <div className="relative">
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      <input
                        type={showPassword ? "text" : "password"}
                        value={user.password}
                        onChange={(e) =>
                          setUser({ ...user, password: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                        required
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
                        type="text"
                        value={user.email}
                        onChange={(e) =>
                          setUser({ ...user, email: e.target.value })
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
                        value={user.role}
                        onChange={(e) => {
                          const selectedRole = e.target.value as userRole;
                          setUser({
                            ...user,
                            role: selectedRole,
                            student_info:
                              selectedRole === "student"
                                ? {
                                    department: "",
                                    generation: 0,
                                    class: "",
                                  }
                                : undefined,
                            teacher_info:
                              selectedRole === "teacher"
                                ? {
                                    department: "",
                                    subjects: [""],
                                  }
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
                  {user.role === "student" && (
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
                          value={user.student_info?.department}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              student_info: {
                                ...user.student_info,
                                department: e.target.value,
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
                          value={user.student_info?.generation}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              student_info: {
                                ...user.student_info,
                                generation: parseInt(e.target.value),
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
                          value={user.student_info?.class}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              student_info: {
                                ...user.student_info,
                                class: e.target.value,
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
                  {user.role === "teacher" && (
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
                          value={user.teacher_info?.department}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              teacher_info: {
                                ...user.teacher_info,
                                department: e.target.value,
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
                          value={user.teacher_info?.subjects?.join(", ") || ""}
                          onChange={(e) =>
                            setUser({
                              ...user,
                              teacher_info: {
                                ...user.teacher_info,
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
                      disabled={loading}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 text-sm text-white bg-blue-500 rounded-md hover:bg-blue-600 disabled:bg-blue-300"
                      disabled={loading}
                    >
                      {loading ? "Creating..." : "Create"}
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
}
