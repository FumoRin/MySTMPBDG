import { Search, Filter, UserPlus, MoreVertical } from "lucide-react";
import { useEffect, useState } from "react";
import AddUserModal from "./components/addUser";
import toast from "react-hot-toast";
import UserOptionsModal from "./components/userOptionModal";

interface User {
  _id: string;
  username: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

export default function AdminUsersPage() {
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalPosition, setModalPosition] = useState<{
    top: Number;
    left: Number;
  }>({ top: 0, left: 0 });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);

  const handleCreateUser = (userData: any) => {
    // Add logic to save user
    console.log(userData);
    setIsAddModalOpen(false);
  };

  const handleEditUser = () => {
    if (selectedUser) {
      console.log("Placeholder for logic editing users:", selectedUser);
    }
    setIsOptionsModalOpen(false);
  };

  const handleDeleteUser = () => {
    if (selectedUser) {
      console.log("Placeholder for logic deleting users:", selectedUser);
    }
    setIsOptionsModalOpen(false);
  };

  const openOptionsModal = (user: User, button: HTMLElement) => {
    setSelectedUser(user);
    const { top, left, height } = button.getBoundingClientRect();
    setModalPosition({ top: top + height + window.scrollY, left: left });
    setIsOptionsModalOpen(true);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        toast.error("Please log in to access this page");
        return;
      }

      try {
        // Fetch users with authorization header
        const response = await fetch("http://localhost:3000/api/users", {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        });

        // Check if the response is successful
        if (!response.ok) {
          // Handle different types of errors based on status
          if (response.status === 401) {
            throw new Error("Unauthorized: Please log in again");
          } else if (response.status === 403) {
            throw new Error("Forbidden: You do not have permission");
          } else {
            throw new Error("Failed to fetch users");
          }
        }

        const data = await response.json();

        setUsers(data);
        setIsLoading(false);
      } catch (error) {
        console.error("Error fetching users:", error);

        // Handle different types of errors
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        setIsLoading(false);

        // Show error toast
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch users"
        );
      }
    };

    fetchUsers();
  }, []);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg transition duration-300 ease-in-out transform hover:bg-blue-600 hover:scale-105"
        >
          <UserPlus size={20} />
          Add New User
        </button>
        <AddUserModal
          isOpen={isAddModalOpen}
          onClose={() => setIsAddModalOpen(false)}
          onSubmit={handleCreateUser}
        />
      </div>

      {/* Search and Filter Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search users..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
        <button className="flex items-center gap-2 px-4 py-2 border rounded-lg">
          <Filter size={20} />
          Filters
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Email
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Role
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {users.map((user) => (
              <tr key={user._id}>
                <td className="px-6 py-4 whitespace-nowrap">{user.username}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.email}</td>
                <td className="px-6 py-4 whitespace-nowrap">{user.role}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button
                    onClick={(e) => openOptionsModal(user, e.currentTarget)}
                    className="text-gray-400 hover:text-gray-600 transition-colors duration-300 ease-in-out"
                  >
                    <MoreVertical size={20} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {/* User Options Modal */}
      <UserOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        onEdit={handleEditUser}
        onDelete={handleDeleteUser}
        position={{
          top: Number(modalPosition.top),
          left: Number(modalPosition.left),
        }}
      />
    </div>
  );
}
