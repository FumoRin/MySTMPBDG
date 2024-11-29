import React, { useState, useEffect, Fragment } from "react";
import { Dialog, Transition } from "@headlessui/react";
import { X } from "lucide-react";
import toast, { Toaster } from "react-hot-toast";
import { Announcement } from "../../../../context/announcementTypes";

interface ModifyAnnouncementModalProps {
  isOpen: boolean;
  onClose: () => void;
  announcement: Announcement;
  onAnnouncementUpdated: (updatedAnnouncement: Announcement) => void;
}

export default function ModifyAnnouncementModal({
  isOpen,
  onClose,
  announcement,
  onAnnouncementUpdated,
}: ModifyAnnouncementModalProps) {
  const [modifiedAnnouncement, setModifiedAnnouncement] =
    useState<Announcement>({ ...announcement });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setModifiedAnnouncement({ ...announcement });
      setError(null);
    }
  }, [isOpen, announcement]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;

    if (name === "target_audience") {
      const select = e.target as HTMLSelectElement;
      const selectedOptions = Array.from(select.selectedOptions).map(
        (option) => option.value
      );
      setModifiedAnnouncement((prev) => ({
        ...prev,
        target_audience: selectedOptions as (
          | "all"
          | "teachers"
          | "students"
          | "department"
        )[],
      }));
    } else {
      setModifiedAnnouncement((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleTargetAudienceChange = (
    value: "all" | "teachers" | "students" | "department"
  ) => {
    setModifiedAnnouncement((prev) => ({
      ...prev,
      target_audience: prev.target_audience.includes(value)
        ? prev.target_audience.filter((item) => item !== value)
        : [...prev.target_audience, value],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    const loadingToast = toast.loading("Updating announcement...");

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("No authentication token found");
      }

      // Create a new date object from the date and time inputs
      const dateStr = modifiedAnnouncement.announcement_date.toString();
      const timeStr = new Date(modifiedAnnouncement.announcement_date)
        .toTimeString()
        .slice(0, 5);
      const [year, month, day] = dateStr.split("T")[0].split("-").map(Number);
      const [hours, minutes] = timeStr.split(":").map(Number);

      const combinedDateTime = new Date(year, month - 1, day, hours, minutes);

      // Create submission data with the combined ISO datetime
      const submissionData = {
        ...modifiedAnnouncement,
        announcement_date: combinedDateTime.toISOString(),
      };

      const response = await fetch(
        `http://localhost:3000/api/announcements/${announcement._id}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(submissionData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || "Failed to update announcement");
      }

      const updatedAnnouncement: Announcement = await response.json();
      toast.dismiss(loadingToast);
      toast.success("Announcement updated successfully");
      onAnnouncementUpdated(updatedAnnouncement);
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
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
        </Transition.Child>

        <div className="fixed inset-0 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all">
                <div className="flex justify-between items-center mb-4">
                  <Dialog.Title className="text-xl font-bold">
                    Modify An Announcement
                  </Dialog.Title>
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
                      value={modifiedAnnouncement.title}
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
                      value={modifiedAnnouncement.content}
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
                        value={
                          modifiedAnnouncement.announcement_date?.toString() ||
                          ""
                        }
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
                        value={new Date(modifiedAnnouncement.announcement_date)
                          .toTimeString()
                          .slice(0, 5)}
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
                              checked={modifiedAnnouncement.target_audience.includes(
                                option
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
                      value={modifiedAnnouncement.location}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md border border-gray-300 px-3 py-2"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Priority
                    </label>
                    <select
                      name="priority"
                      value={modifiedAnnouncement.priority}
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
                      value={modifiedAnnouncement.category}
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
                      {isLoading ? "Updating..." : "Update"}
                    </button>
                  </div>
                </form>
                <Toaster />
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
}
