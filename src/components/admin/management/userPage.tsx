import {
  Search,
  Filter,
  UserPlus,
  MoreVertical,
  ChevronUp,
  ChevronDown,
} from "lucide-react";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import UserOptionsModal from "./components/user/userOptionModal";
import AddUserModal from "./components/user/addUser";
import DeleteModal from "./components/user/userDeleteModal";
import UserModifyModal from "./components/user/userModifyModal";
import UserFilterModal from "./components/user/userFilterModal";
import { User } from "../../../context/userTypes";

type SortableFields = "username" | "email" | "full_name";
type SortDirection = "asc" | "desc";

interface ModalPosition {
  top: number;
  left: number;
}

export default function AdminUsersPage() {
  // State Management
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isOptionsModalOpen, setIsOptionsModalOpen] = useState(false);
  const [isDeleteConfirmationOpen, setIsDeleteConfirmationOpen] =
    useState(false);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [modalPosition, setModalPosition] = useState<ModalPosition>({
    top: 0,
    left: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [users, setUsers] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortField, setSortField] = useState<SortableFields>("username");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const [filters, setFilters] = useState({
    role: "",
    department: "",
    generation: "",
  });

  // Data Fetching
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
        const response = await fetch("http://localhost:3000/api/users", {
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
            throw new Error("Failed to fetch users");
          }
        }

        const data = await response.json();
        setUsers(data);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        toast.error(
          error instanceof Error ? error.message : "Failed to fetch users"
        );
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, []);

  // User Management Functions
  const handleCreateUser = (userData: User) => {
    setUsers((prevUsers) => [...prevUsers, userData]);
    setIsAddModalOpen(false);
  };

  const handleModifyUser = (updatedUser: User) => {
    setUsers((prevUsers) =>
      prevUsers.map((user) =>
        user._id === updatedUser._id ? updatedUser : user
      )
    );
    setIsModifyModalOpen(false);
  };

  const handleDeleteUser = (userId: string) => {
    setUsers((prevUsers) => prevUsers.filter((user) => user._id !== userId));
    setIsDeleteConfirmationOpen(false);
  };

  // Modal Management Functions
  const handleOpenModifyUser = (user: User) => {
    setSelectedUser(user);
    setIsModifyModalOpen(true);
    setIsOptionsModalOpen(false);
  };

  const initiateUserDeletion = (user: User) => {
    setSelectedUser(user);
    setIsOptionsModalOpen(false);
    setIsDeleteConfirmationOpen(true);
  };

  const openOptionsModal = (user: User, button: HTMLElement) => {
    setSelectedUser(user);
    const { top, left, height } = button.getBoundingClientRect();
    const modalWidth = 150;
    setModalPosition({
      top: top + height + window.scrollY,
      left: left - modalWidth,
    });
    setIsOptionsModalOpen(true);
  };

  // Sorting and Filtering Functions
  const handleSort = (field: SortableFields) => {
    if (sortField === field) {
      setSortDirection(sortDirection === "asc" ? "desc" : "asc");
    } else {
      setSortField(field);
      setSortDirection("asc");
    }
  };

  const getFilteredAndSortedUsers = () => {
    let filtered = users.filter((user) => {
      // Search term filter
      const matchesSearch =
        (user.profile &&
          user.profile.full_name
            .toLowerCase()
            .includes(searchTerm.toLowerCase())) ||
        user.username.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email.toLowerCase().includes(searchTerm.toLowerCase());

      // Role filter
      const matchesRole = !filters.role || user.role === filters.role;

      // Department filter
      const matchesDepartment =
        !filters.department ||
        user.teacher_info?.department === filters.department ||
        user.student_info?.department === filters.department;

      // Generation filter
      const matchesGeneration =
        !filters.generation ||
        Number(user.student_info?.generation) === Number(filters.generation);

      return (
        matchesSearch && matchesRole && matchesDepartment && matchesGeneration
      );
    });

    return filtered.sort((a, b) => {
      let aValue: string;
      let bValue: string;

      if (sortField === "full_name") {
        aValue = a.profile?.full_name || "";
        bValue = b.profile?.full_name || "";
      } else {
        aValue = a[sortField];
        bValue = b[sortField];
      }

      return sortDirection === "asc"
        ? aValue.localeCompare(bValue)
        : bValue.localeCompare(aValue);
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full">Loading...</div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  const filteredAndSortedUsers = getFilteredAndSortedUsers();

  return (
    <div className="container mx-auto p-6 bg-gray-50 h-full min-w-full">
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">User Management</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg 
                   transition duration-300 ease-in-out hover:bg-blue-600 hover:scale-105"
        >
          <UserPlus size={20} />
          Add New User
        </button>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <button
          onClick={() => setIsFilterModalOpen(true)}
          className="flex items-center gap-2 px-4 py-2 border rounded-lg"
        >
          <Filter size={20} />
          Filters
          {/* Optional: Show number of active filters */}
          {filters.role || filters.department || filters.generation ? (
            <span className="text-xs text-red-500">Active</span>
          ) : null}
        </button>
      </div>

      {/* Users Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("full_name")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Full Name</span>
                    {sortField === "full_name" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th
                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                  onClick={() => handleSort("username")}
                >
                  <div className="flex items-center space-x-1">
                    <span>Username</span>
                    {sortField === "username" &&
                      (sortDirection === "asc" ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      ))}
                  </div>
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contact
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAndSortedUsers.map((user, index) => (
                <tr
                  key={user._id}
                  className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {user.profile?.full_name || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {user.username || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                        ${
                          user.role === "teacher"
                            ? "bg-green-100 text-green-800"
                            : user.role === "student"
                            ? "bg-blue-100 text-blue-800"
                            : "bg-purple-100 text-purple-800"
                        }`}
                    >
                      {user.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {user.teacher_info?.department ||
                      user.student_info?.department}
                    {user.student_info && (
                      <div className="text-xs text-gray-400">
                        Class: {user.student_info.class}{" "}
                        {user.student_info.generation}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>{user.profile?.phone || "N/A"}</div>
                    <div className="text-xs">
                      {user.profile?.address || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button
                      onClick={(e) => openOptionsModal(user, e.currentTarget)}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <MoreVertical size={20} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modals */}
      <AddUserModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={(userForm) => handleCreateUser({ ...userForm, _id: "" })}
      />

      <UserOptionsModal
        isOpen={isOptionsModalOpen}
        onClose={() => setIsOptionsModalOpen(false)}
        onEdit={() => selectedUser && handleOpenModifyUser(selectedUser)}
        onDelete={() => selectedUser && initiateUserDeletion(selectedUser)}
        position={modalPosition}
      />

      <DeleteModal
        isOpen={isDeleteConfirmationOpen}
        onClose={() => setIsDeleteConfirmationOpen(false)}
        user={
          selectedUser
            ? {
                ...selectedUser,
              }
            : null
        }
        onUserDeleted={handleDeleteUser}
      />

      {selectedUser && (
        <UserModifyModal
          isOpen={isModifyModalOpen}
          onClose={() => setIsModifyModalOpen(false)}
          user={selectedUser}
          onUserUpdated={handleModifyUser}
        />
      )}

      <UserFilterModal
        isOpen={isFilterModalOpen}
        onClose={() => setIsFilterModalOpen(false)}
        users={users}
        currentFilters={filters}
        onApplyFilters={(newFilters) => setFilters(newFilters)}
      />
    </div>
  );
}
