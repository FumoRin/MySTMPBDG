import React from "react";
import { UserRoundPenIcon, Trash2Icon } from "lucide-react";
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
  if (!isOpen) return null;

  return (
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
        <button onClick={onClose} className="mt-4 text-gray-500 underline">
          Cancel
        </button>
      </div>
    </div>
  );
};

export default UserOptionsModal;
