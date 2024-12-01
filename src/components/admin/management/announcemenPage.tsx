import { Plus, Search, Calendar } from "lucide-react";
import { useState, useEffect } from "react";
import toast, { Toaster } from "react-hot-toast";
import AnnouncementModal from "./components/announcement/addAnnouncement";
import { Announcement } from "../../../context/announcementTypes";
import DeleteModal from "./components/announcement/announcementDeleteModal";
import ModifyAnnouncementModal from "./components/announcement/announcementModifyModal";

export default function AdminAnnouncementsPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [announcement, setAnnouncement] = useState<Announcement[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setIsLoading] = useState(true);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] =
    useState<Announcement | null>(null);
  const [isModifyModalOpen, setIsModifyModalOpen] = useState(false);

  useEffect(() => {
    const fetchAnnouncements = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        setIsLoading(false);
        toast.error("Please log in to access this page");
        return;
      }

      try {
        const response = await fetch(
          "http://localhost:3000/api/announcements",
          {
            method: "GET",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

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
        setAnnouncement(data);
      } catch (error) {
        console.error("Error fetching announcements:", error);
        setError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
        toast.error(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setIsLoading(false);
      }
    };
    fetchAnnouncements();
  }, []);

  const handleDeleteClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsDeleteModalOpen(true);
  };

  const handleAnnouncementDeleted = (announcementId: string) => {
    setAnnouncement((prevAnnouncements) =>
      prevAnnouncements.filter((a) => a._id !== announcementId)
    );
  };

  const handleAnnouncementUpdated = (updatedAnnouncement: Announcement) => {
    setAnnouncement((prevAnnouncements) =>
      prevAnnouncements.map((a) =>
        a._id === updatedAnnouncement._id ? updatedAnnouncement : a
      )
    );
  };

  const handleEditClick = (announcement: Announcement) => {
    setSelectedAnnouncement(announcement);
    setIsModifyModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-6 bg-gray-50 h-full min-w-full">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Announcement Management</h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg"
        >
          <Plus size={20} />
          Create Announcement
        </button>
      </div>

      <AnnouncementModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />

      {/* Search Bar */}
      <div className="flex gap-4 mb-6">
        <div className="flex-1 relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search announcements..."
            className="w-full pl-10 pr-4 py-2 border rounded-lg"
          />
        </div>
      </div>

      {/* Announcements Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {announcement.map((item) => (
          <div
            key={item._id}
            className="bg-white p-6 rounded-lg shadow relative flex flex-col min-h-[250px]"
          >
            <div className="flex-1">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-500 flex items-center gap-2">
                  <Calendar size={16} />
                  {new Date(item.announcement_date).toLocaleDateString()}
                </span>
                <span className="text-xs text-gray-400 ml-6">
                  {new Date(item.announcement_date).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    item.priority === "high"
                      ? "bg-red-100 text-red-800"
                      : item.priority === "medium"
                      ? "bg-yellow-100 text-yellow-800"
                      : "bg-green-100 text-green-800"
                  }`}
                >
                  {item.priority}
                </span>
              </div>
              <h3 className="font-semibold mb-2">{item.title}</h3>
              <p className="text-gray-600 text-sm mb-4">{item.content}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {item.category}
                </span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                  {item.location}
                </span>
              </div>
            </div>

            <div className="mt-4 pt-4 border-t flex gap-2">
              <button
                className="text-blue-500 text-sm hover:text-blue-700"
                onClick={() => handleEditClick(item)}
              >
                Edit
              </button>
              <button
                className="text-red-500 text-sm hover:text-red-700"
                onClick={() => handleDeleteClick(item)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        <Toaster />
      </div>

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        announcement={selectedAnnouncement}
        onAnnouncementDeleted={handleAnnouncementDeleted}
      />

      {selectedAnnouncement && (
        <ModifyAnnouncementModal
          isOpen={isModifyModalOpen}
          onClose={() => {
            setIsModifyModalOpen(false);
            setSelectedAnnouncement(null);
          }}
          announcement={selectedAnnouncement}
          onAnnouncementUpdated={handleAnnouncementUpdated}
        />
      )}
    </div>
  );
}
