import React, { useEffect } from "react";
import { UserRoundPenIcon, Trash2Icon, XIcon } from "lucide-react";
import { Transition } from "@headlessui/react";

interface UserOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  position: { top: number; left: number };
}

const UserOptionsModal: React.FC<UserOptionsModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  position,
}) => {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Check if the click is outside the modal
      const modalElement = document.querySelector(".user-options-modal");
      if (
        isOpen &&
        modalElement &&
        !modalElement.contains(event.target as Node)
      ) {
        onClose();
      }
    };

    // Add event listener when modal is open
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    // Cleanup the event listener
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
      <div
        className={`absolute z-10 bg-white rounded-lg shadow-lg p-2 user-options-modal`}
        style={{ top: position.top, left: position.left }}
      >
        <div className="flex flex-col">
          <button onClick={onEdit} className="mb-2 px-4 py-2 text-left">
            <UserRoundPenIcon className="w-4 h-4 mr-2 inline-block" />
            Edit User
          </button>
          <button onClick={onDelete} className="px-4 py-2 text-left">
            <Trash2Icon className="w-4 h-4 mr-2 inline-block" />
            Delete User
          </button>
          <button
            onClick={onClose}
            className="px-4 py-4 text-left text-gray-500 underline"
          >
            <XIcon className="w-4 h-4 mr-2 inline-block" />
            Cancel
          </button>
        </div>
      </div>
    </Transition>
  );
};

export default UserOptionsModal;
