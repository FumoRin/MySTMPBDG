import {
  Bars3Icon,
  Bars2Icon,
  EllipsisVerticalIcon,
} from "@heroicons/react/24/solid";
import reactLogo from "../assets/react.svg"; // Import the SVG file
import { useState, useContext, Children, createContext } from "react";

// Define context type for sidebar expansion state
const sidebarContext = createContext<{ expanded: boolean } | undefined>(
  undefined
);

// Main Sidebar component
export default function Sidebar({ children }: { children: React.ReactNode }) {
  const [expanded, setExpanded] = useState(true); // State to manage sidebar expansion

  return (
    <aside className={`h-screen transition-all ${expanded ? "w-64" : "w-24"}`}>
      <nav className="h-full flex flex-col bg-white border-r shadow-sm">
        {/* Sidebar Header Section */}
        <div className="p-1 m-3 flex justify-center items-center">
          <img
            src={reactLogo}
            alt="React"
            className={`overflow-hidden transition-all ${
              expanded ? "w-12" : "w-0"
            }`}
          />

          {expanded && (
            <h3 className="text-base px-3 font-bold leading-2">MySTMPBDG</h3>
          )}

          <button
            onClick={() => setExpanded((curr) => !curr)}
            className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200"
          >
            {expanded ? (
              <Bars3Icon className="w-6 h-6" />
            ) : (
              <Bars2Icon className="w-6 h-6 mx-auto" />
            )}
          </button>
        </div>
        {/* End of Sidebar Header Section */}

        {/* Sidebar Content Section */}
        <sidebarContext.Provider value={{ expanded }}>
          <ul className="flex-1 p valuex-1 py-2 overflow-y-auto">{children}</ul>
        </sidebarContext.Provider>
        {/* End of Sidebar Content Section */}
        {/* Account Section */}
        <div className={`border-t flex p-3 items-center`}>
          <img
            src="https://ui-avatars.com/api/?background=c7d2fe&color=3730a3&bold=true&name=Dimas+Faiz"
            alt="Profile"
            className={`w-10 h-10 rounded-md ${expanded ? "" : "ml-3"}`}
          />
          <div
            className={`flex flex-col ml-3 overflow-hidden transition-all ${
              expanded ? "w-52" : "w-0"
            }`}
          >
            <h4 className="font-semibold text-sm truncate">Dimas Faiz</h4>
            <span className="flex text-xs text-gray-500 truncate">
              edu.dimasfaizsatria@gmail.com
            </span>
          </div>
          <button className="ml-auto p-1">
            <EllipsisVerticalIcon
              className={`${expanded ? "w-5 h-5 text-gray-500" : ""}`}
            />
          </button>
        </div>
        {/* End of Account Section */}
      </nav>
    </aside>
  );
}

// SidebarItem component for rendering individual items in the sidebar
export function SidebarItem({
  icon,
  text,
  active,
  alert,
}: {
  icon?: React.ReactNode;
  text?: string;
  active?: boolean;
  alert?: boolean;
}) {
  const { expanded } = useContext(sidebarContext)!;

  const itemClasses = `relative flex items-center py-2 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
    active
      ? "bg-gradient-to-tr from-indigo-200 to-indigo-100 text-indigo-800"
      : "hover:bg-indigo-50 text-gray-600"
  }`;

  return (
    <li className={itemClasses}>
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
          className={`absolute right-2 w-2 h-2 rounded bg-indigo-400 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}
    </li>
  );
}
