import React, { useState, Fragment } from "react";
import { Transition } from "@headlessui/react";
import toast from "react-hot-toast";
import { Announcement } from "../../../../../context/announcementTypes";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement | null;
  onAnnouncementDeleted: (userId: string) => void;
}

const DeleteModal: React.FC<DeleteModalProps> = ({
  isOpen,
  onClose,
  announcement,
  onAnnouncementDeleted,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDeleteUser = async () => {
    if (!announcement) return;

    setIsDeleting(true);

    const token = localStorage.getItem("token");
    if (!token) {
      toast.error("Authentication token not found");
      setIsDeleting(false);
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:3000/api/announcements/${announcement._id}`,
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

      // Call the callback to remove announcement from parent component's state
      onAnnouncementDeleted(announcement._id);

      // Close modal and show success toast
      onClose();
      toast.success(`Announcement deleted successfully`);
    } catch (error) {
      console.error("Error deleting announcement:", error);
      toast.error(
        error instanceof Error ? error.message : "Failed to delete Announcement"
      );
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <Transition show={isOpen} as={Fragment}>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <div className="fixed inset-0 flex items-center justify-center">
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/50" onClick={onClose} />
          </Transition.Child>

          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0 scale-95"
            enterTo="opacity-100 scale-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-auto relative z-50">
              <h2 className="text-xl font-bold text-red-600 mb-4">
                Confirm Announcement Deletion
              </h2>
              <p className="mb-4">
                Are you sure you want to delete the selected Announcement? This
                action cannot be undone.
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
                    "Delete Announcement"
                  )}
                </button>
              </div>
            </div>
          </Transition.Child>
        </div>
      </div>
    </Transition>
  );
};

export default DeleteModal;
