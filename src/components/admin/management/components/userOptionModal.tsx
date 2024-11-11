import React from "react";
import { UserRoundPenIcon, Trash2Icon, XIcon } from "lucide-react";
import { Transition } from "@headlessui/react";

interface UserOptionsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onDelete: () => void;
  position: { top: number; left: number }; // New prop for position
}

const UserOptionsModal: React.FC<UserOptionsModalProps> = ({
  isOpen,
  onClose,
  onEdit,
  onDelete,
  position,
}) => {
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
        className={`absolute z-10 bg-white rounded-lg shadow-lg p-4`}
        style={{ top: position.top, left: position.left }} // Use position prop for placement
      >
        {/* <h2 className="text-lg font-bold mb-4">User Options</h2> */}
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
