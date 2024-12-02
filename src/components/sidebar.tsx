import React, { useContext, createContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Menu, ChevronLeft, MoreVertical, LogOut } from "lucide-react";
import reactLogo from "../assets/MYSTMBDG1.png";
import { Modal } from "./auth/logout";
import { useAuth } from "../context/authContext";

// Sidebar context remains the same
export const sidebarContext = createContext<{ expanded: boolean }>({
  expanded: true,
});

// Main Sidebar component
export default function Sidebar({
  children,
  expanded,
  setExpanded,
}: {
  children: React.ReactNode;
  expanded: boolean;
  setExpanded: (value: boolean) => void;
}) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
    setIsLogoutModalOpen(false);
  };

  // Safe user data extraction
  const userName = user?.name || "User";
  const userEmail = user?.email || "user@example.com";

  return (
    <sidebarContext.Provider value={{ expanded }}>
      <aside
        className={`fixed top-0 left-0 bottom-0 transition-all ${
          expanded ? "w-64" : "w-24"
        } bg-white z-10 flex flex-col`} // Added flex-col to ensure full height layout
      >
        {/* Sidebar Header */}
        <div className="p-1 m-3 flex justify-between items-center">
          <img
            src={reactLogo}
            alt="Logo"
            className={`overflow-hidden transition-all ${
              expanded ? "w-12" : "w-0"
            }`}
          />

          {expanded && (
            <h3 className="text-base px-3 font-bold leading-2">MySTMPBDG</h3>
          )}

          <button
            onClick={() => setExpanded(!expanded)}
            className="p-2 mr-2 rounded-lg bg-calypsoLight-700 hover:bg-calypsoLight-500"
          >
            {expanded ? (
              <ChevronLeft className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6 mx-auto" />
            )}
          </button>
        </div>

        {/* Sidebar Content */}
        <div className="flex-1 flex flex-col justify-between px-1 py-2 overflow-y-auto">
          <div>{children}</div>

          <div>
            <hr className="my-3" />
            <SidebarItem
              icon={<LogOut />}
              text="Logout"
              onClick={() => setIsLogoutModalOpen(true)}
            />
          </div>
        </div>

        {/* Logout Modal */}
        {isLogoutModalOpen && (
          <Modal
            isOpen={isLogoutModalOpen}
            onClose={() => setIsLogoutModalOpen(false)}
            onConfirm={handleLogout}
            title="Confirm Logout"
          >
            <p>Are you sure you want to log out?</p>
            <p className="mt-2 text-sm text-gray-500">
              You will be redirected to the login page.
            </p>
          </Modal>
        )}

        {/* Account Section */}
        <div className={`border-t border-t-salmon-500 flex p-3 items-center`}>
          <img
            src={`https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=${userName}`}
            alt="Profile"
            className={`w-10 h-10 rounded-md ${expanded ? "" : "ml-3"}`}
          />

          <div
            className={`flex flex-col ml-3 overflow-hidden transition-all ${
              expanded ? "w-52 opacity-100" : "w-0 opacity-0"
            }`}
          >
            <h4 className="font-semibold text-sm truncate">{userName}</h4>
            <span className="flex text-xs text-gray-500 truncate">
              {userEmail}
            </span>
          </div>

          {expanded && (
            <button className="ml-auto p-1">
              <MoreVertical className="w-5 h-5 text-gray-500" />
            </button>
          )}
        </div>
      </aside>
    </sidebarContext.Provider>
  );
}

// SidebarItem component
export function SidebarItem({
  icon,
  text,
  active,
  alert,
  to,
  onClick,
}: {
  icon?: React.ReactNode;
  text?: string;
  active?: boolean;
  alert?: boolean;
  to?: string;
  onClick?: () => void;
}) {
  const { expanded } = useContext(sidebarContext)!;

  const itemClasses = `relative flex items-center py-3 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
    active
      ? "bg-gradient-to-tr from-calypsoLight-700 to-calypsoLight-800 text-grey-800"
      : "hover:bg-calypsoLight-900 text-grey-600"
  }`;

  const handleClick = () => {
    if (onClick) onClick();
  };

  return (
    <li className={itemClasses} onClick={handleClick}>
      {icon && (
        <span
          className={`flex items-center justify-center transition-all duration-300 ${
            expanded ? "w-6 h-6 mr-3" : "w-6 h-6 mx-auto"
          }`}
        >
          {icon}
        </span>
      )}

      {expanded && text && (
        <span className="flex items-center truncate transition-all w-52 ml-3">
          {text}
        </span>
      )}

      {alert && (
        <div
          className={`absolute right-2 w-2 h-2 rounded bg-calypsoLight-100 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}

      {to && <Link to={to} className="absolute inset-0" />}
    </li>
  );
}
