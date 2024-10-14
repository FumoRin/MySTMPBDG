import {
  Menu,
  ChevronLeft,
  MoreVertical,
  LifeBuoy,
  Settings,
} from "lucide-react";
import reactLogo from "../assets/react.svg"; // Import the SVG file
import { useContext, createContext } from "react";
import { Link } from "react-router-dom";

// Define context type for sidebar expansion state
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
  return (
    <sidebarContext.Provider value={{ expanded }}>
      <aside
        className={`fixed top-0 left-0 bottom-0 transition-all ${
          expanded ? "w-64" : "w-24"
        }`}
      >
        <nav className="h-full flex flex-col border-r shadow-sm">
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
              onClick={() => setExpanded(!expanded)}
              className="p-2 rounded-lg bg-calypsoLight-700 hover:bg-calypsoLight-500"
            >
              {expanded ? (
                <ChevronLeft className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6 mx-auto" />
              )}
            </button>
          </div>
          {/* End of Sidebar Header Section */}

          {/* Sidebar Content Section */}
          <sidebarContext.Provider value={{ expanded }}>
            <ul className="flex-1 h-full flex flex-col justify-between px-1 py-2 overflow-y-auto">
              <div>{children}</div>
              <div>
                <hr className="my-3" />
                <SidebarItem
                  icon={<LifeBuoy />}
                  text="Bantuan"
                  to="/bantuan"
                  active={location.pathname === "/bantuan"}
                />
                <SidebarItem
                  icon={<Settings />}
                  text="Settings"
                  to="/settings"
                  active={location.pathname === "/settings"}
                />
              </div>
            </ul>
          </sidebarContext.Provider>
          {/* End of Sidebar Content Section */}

          {/* Account Section */}
          <div className={`border-t border-t-salmon-500 flex p-3 items-center`}>
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
            {expanded && (
              <button className="ml-auto p-1">
                <MoreVertical className="w-5 h-5 text-gray-500" />
              </button>
            )}
          </div>
          {/* End of Account Section */}
        </nav>
      </aside>
    </sidebarContext.Provider>
  );
}

// SidebarItem component for rendering individual items in the sidebar
export function SidebarItem({
  icon,
  text,
  active,
  alert,
  to,
}: {
  icon?: React.ReactNode;
  text?: string;
  active?: boolean;
  alert?: boolean;
  to?: string;
}) {
  const { expanded } = useContext(sidebarContext)!;

  const itemClasses = `relative flex items-center py-3 px-3 my-1 font-medium rounded-md cursor-pointer transition-colors ${
    active
      ? "bg-gradient-to-tr from-calypsoLight-700 to-calypsoLight-800 text-grey-800"
      : "hover:bg-calypsoLight-900 text-grey-600"
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
          className={`absolute right-2 w-2 h-2 rounded bg-calypsoLight-100 ${
            expanded ? "" : "top-2"
          }`}
        ></div>
      )}
      {to && <Link to={to} className="absolute inset-0" />}
    </li>
  );
}
