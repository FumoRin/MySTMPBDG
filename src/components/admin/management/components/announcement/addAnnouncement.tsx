import { Fragment } from "react";
import { X } from "lucide-react";
import { useState } from "react";
import { Transition } from "@headlessui/react";
import toast, { Toaster } from "react-hot-toast";

// Updated interface to match more common database structure
interface AnnouncementForm {
  title: string;
  content: string;
  author_id: string; // This should be the ObjectId of the current user
  target_audience: ("all" | "teachers" | "students" | "department")[];
  priority: "low" | "medium" | "high" | "urgent";
  category: "academic" | "meeting" | "event" | "competition" | "general";
  location?: string;
  announcement_date: string | Date;
  publish_date?: Date;
  attachments?: {
    name: string;
    url: string;
    type?: string;
  }[];
  status?: "scheduled" | "draft" | "published";
  announcement_time?: string;
}

interface AnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRefresh?: () => void;
}

export default function AnnouncementModal({
  isOpen,
  onClose,
  onRefresh,
}: AnnouncementModalProps) {
  // Updated initial state to match new interface
  const [formData, setFormData] = useState<AnnouncementForm>({
    title: "",
    content: "",
    target_audience: ["all"],
    priority: "low",
    category: "general",
    announcement_date: new Date().toISOString().split("T")[0],
    announcement_time: "00:00",
    location: "",
    status: "scheduled",
    author_id: localStorage.getItem("_id") || "", // Add required author_id field
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    setFormData((prevData) => {
      if (name === "target_audience") {
        return {
          ...prevData,
          [name]: [value as "all" | "teachers" | "students" | "department"],
        };
      }
      return {
        ...prevData,
        [name]: value,
      };
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      // Create a new date object from the date and time inputs
      const dateStr = formData.announcement_date.toString();
      const timeStr = formData.announcement_time || "00:00";
      const [year, month, day] = dateStr.split("-").map(Number);
      const [hours, minutes] = timeStr.split(":").map(Number);

      const combinedDateTime = new Date(year, month - 1, day, hours, minutes);

      // Create submission data with the combined ISO datetime and publish_date
      const submissionData = {
        ...formData,
        announcement_date: combinedDateTime.toISOString(),
        publish_date: new Date().toISOString(),
        announcement_time: undefined, // Remove the separate time field
      };

      const response = await fetch("http://localhost:3000/api/announcements", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(submissionData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to create announcement");
      }

      toast.success("Announcement Created Successfully!");
      // Reset form data
      setFormData({
        title: "",
        content: "",
        announcement_date: "",
        announcement_time: "00:00",
        location: "",
        status: "scheduled",
        target_audience: ["all"],
        priority: "low",
        category: "general",
        author_id: formData.author_id, // Keep the existing author_id
      });

      onRefresh?.();
      onClose();
    } catch (err) {
      toast.error(
        err instanceof Error
          ? err.message
          : "An error occurred while creating the announcement"
      );
    } finally {
      setIsLoading(false);
    }
  };

  // Add this handler for checkboxes
  const handleTargetAudienceChange = (
    value: "all" | "teachers" | "students" | "department"
  ) => {
    setFormData((prev) => ({
      ...prev,
      target_audience: prev.target_audience.includes(value)
        ? prev.target_audience.filter((item) => item !== value)
        : [...prev.target_audience, value],
    }));
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
                  <h2 className="text-xl font-bold">Create New Announcement</h2>
                  <button
                    onClick={onClose}
                    className="text-gray-500 hover:text-gray-700"
                  >
                    <X size={20} />
                  </button>
                </div>

                {error && (
                  <div className="mb-4 p-2 bg-red-100 text-red-700 rounded">
                    {error}
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Title
                    </label>
                    <input
                      type="text"
                      name="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Description
                    </label>
                    <textarea
                      name="content"
                      value={formData.content}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="announcement_date"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Date
                      </label>
                      <input
                        type="date"
                        id="announcement_date"
                        name="announcement_date"
                        value={formData.announcement_date?.toString() || ""}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="announcement_time"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Time
                      </label>
                      <input
                        type="time"
                        id="announcement_time"
                        name="announcement_time"
                        value={formData.announcement_time}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                        step="60"
                        min="00:00"
                        max="23:59"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Target Audience
                    </label>
                    <div className="grid grid-cols-2 gap-3">
                      {["all", "teachers", "students", "department"].map(
                        (option) => (
                          <label
                            key={option}
                            className="flex items-center space-x-2"
                          >
                            <input
                              type="checkbox"
                              checked={formData.target_audience.includes(
                                option as
                                  | "all"
                                  | "teachers"
                                  | "students"
                                  | "department"
                              )}
                              onChange={() =>
                                handleTargetAudienceChange(
                                  option as
                                    | "all"
                                    | "teachers"
                                    | "students"
                                    | "department"
                                )
                              }
                              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                            />
                            <span className="text-sm text-gray-700 capitalize">
                              {option}
                            </span>
                          </label>
                        )
                      )}
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Location
                    </label>
                    <input
                      type="text"
                      name="location"
                      value={formData.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    <select
                      name="status"
                      value={formData.status}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="scheduled">Scheduled</option>
                      <option value="draft">Draft</option>
                      <option value="published">Published</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={formData.priority}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="low">Low</option>
                      <option value="medium">Medium</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Category
                    </label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    >
                      <option value="academic">Academic</option>
                      <option value="meeting">Meeting</option>
                      <option value="event">Event</option>
                      <option value="competition">Competition</option>
                      <option value="general">General</option>
                    </select>
                  </div>

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
                      {isLoading ? "Creating..." : "Create"}
                    </button>
                  </div>
                </form>
                <Toaster />
              </div>
            </Transition.Child>
          </div>
        </div>
      </Transition.Child>
    </Transition>
  );
}
