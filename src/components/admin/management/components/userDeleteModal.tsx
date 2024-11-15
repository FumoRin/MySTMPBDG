// components/DeleteModal.tsx
import React, { useState } from "react";
import toast from "react-hot-toast";

interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  onUserDeleted: (userId: string) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  user,
  onUserDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = async () => {
    if (!user) return;

    setIsDeleting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/users/${user._id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        // Handle different error scenarios
        if (response.status === 401) {
          throw new Error("Unauthorized: Please log in again");
        } else if (response.status === 403) {
          throw new Error(
            "Forbidden: You do not have permission to delete users"
          );
        } else {
          throw new Error(`Failed to delete user ${Error}`);
        }
      }

      // Call the callback to remove user from parent component's state
      onUserDeleted(user._id);

      // Close modal and show success toast
      onClose();
      toast.success(`User ${user.username} deleted successfully`);
    } catch (error) {
      console.error("Error deleting user:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete user"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen || !user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-xl font-bold text-red-600 mb-4">
          Confirm User Deletion
        </h2>
        <p className="mb-4">
          Are you sure you want to delete the user{" "}
          <strong>{user.username}</strong>? This action cannot be undone.
        </p>
        <div className="flex justify-end space-x-4">
          <button
            onClick={onClose}
            disabled={isDeleting}
            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleDeleteUser}
            disabled={isDeleting}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 flex items-center"
          >
            {isDeleting ? (
              <>
                <svg
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Deleting...
              </>
            ) : (
              "Delete User"
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
