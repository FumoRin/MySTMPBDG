import { UserPlus } from "lucide-react";
import { useState } from "react";
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
}

interface ApiResponse {
  message: string;
  user: {
    username: string;
    email: string;
    role: string;
    profile: {
      full_name: string;
      phone: string;
      address: string;
      photo_url: string;
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
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const loadingToast = toast.loading("Creating user...");

    try {
      const response = await fetch("http://localhost:3000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          username: user.username,
          password: user.password,
          email: user.email,
          role: user.role,
          profile: {
            full_name: user.username,
          },
        }),
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
        password: user.password,
        name: data.user.profile.full_name,
        email: data.user.email,
        role: data.user.role as userRole,
      });
      onClose();
      setUser({
        username: "",
        password: "",
        name: "",
        email: "",
        role: "student",
      });
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error(error instanceof Error ? error.message : "An error occurred");
      setError(error instanceof Error ? error.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md max-h-[90vh] overflow-y-auto">
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
                onChange={(e) => setUser({ ...user, username: e.target.value })}
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
                onChange={(e) => setUser({ ...user, password: e.target.value })}
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2 pr-10"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-2 top-[70%] transform -translate-y-1/2"
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
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
                onChange={(e) => setUser({ ...user, email: e.target.value })}
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
                onChange={(e) =>
                  setUser({ ...user, role: e.target.value as userRole })
                }
                className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="sysadmin">Sysadmin</option>
              </select>
            </div>
          </div>

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
    </div>
  );
}
