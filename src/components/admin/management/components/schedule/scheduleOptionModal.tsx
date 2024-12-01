import React, { useEffect } from "react";
import { CalendarCog, CalendarX, XIcon } from "lucide-react";
import { Transition } from "@headlessui/react";

interface ScheduleOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  position: { top: number; left: number };
}

const ScheduleOptionsModal: React.FC<ScheduleOptionsModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  position,
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const modalElement = document.querySelector(".schedule-options-modal");
      if (
        isOpen &&
        modalElement &&
        !modalElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  return (
    <Transition
      show={isOpen}
      enter="transition-opacity duration-200"
      enterFrom="opacity-0"
      enterTo="opacity-100"
      leave="transition-opacity duration-200"
      leaveFrom="opacity-100"
      leaveTo="opacity-0"
    >
      <div className="fixed inset-0 z-40" onClick={onClose}>
        <div
          className="absolute z-50 bg-white rounded-lg shadow-lg p-2 schedule-options-modal"
          style={{ top: position.top, left: position.left - 150 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex flex-col">
            <button
              onClick={onEdit}
              className="mb-2 px-4 py-2 text-left hover:bg-gray-100 rounded-md"
            >
              <CalendarCog className="w-4 h-4 mr-2 inline-block" />
              Edit Schedule
            </button>
            <button
              onClick={onDelete}
              className="px-4 py-2 text-left hover:bg-gray-100 rounded-md"
            >
              <CalendarX className="w-4 h-4 mr-2 inline-block" />
              Delete Schedule
            </button>
            <button
              onClick={onClose}
              className="px-4 py-4 text-left text-gray-500 hover:bg-gray-100 rounded-md"
            >
              <XIcon className="w-4 h-4 mr-2 inline-block" />
              Cancel
            </button>
          </div>
        </div>
      </div>
    </Transition>
  );
};

export default ScheduleOptionsModal;
