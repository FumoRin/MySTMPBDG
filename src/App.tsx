import HomeHeader from "./components/home/homeHeader";
import HomeMain from "./components/home/homeMain";
import Sidebar, { SidebarItem } from "./components/sidebar";
import ChatApp from "./components/chatapp/chatApp";
import SchedulePage from "./components/schedule/schedulePage";
import AuthPage from "./components/auth/authPage";
import AdminPage from "./components/admin/adminPage";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom"; // Ensure correct import
import { useState, useEffect } from "react";
import {
  Home,
  MessageSquare,
  Calendar,
  Users,
  Bell,
  Layout,
} from "lucide-react";

function SchedulePageWrapper({ expanded }: { expanded: boolean }) {
  return <SchedulePage expanded={expanded} />;
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

function AppContent() {
  const [expanded, setExpanded] = useState(true); // State to manage sidebar expansion
  const location = useLocation();
  const isLoginPage = location.pathname === "/login";
  const isAdminPage = location.pathname.startsWith("/admin");

  // Get navigation items based on whether we're in admin section or main app
  const getNavigationItems = () => {
    if (isAdminPage) {
      return [
        {
          icon: <Layout />,
          text: "Dashboard",
          to: "/admin",
        },
        {
          icon: <Users />,
          text: "User Management",
          to: "/admin/users",
        },
        {
          icon: <Bell />,
          text: "Announcements",
          to: "/admin/announcements",
        },
        {
          icon: <Calendar />,
          text: "Schedule",
          to: "/admin/schedule",
        },
      ];
    }

    // Regular app navigation
    return [
      {
        icon: <Home />,
        text: "Home",
        to: "/home",
      },
      {
        icon: <Calendar />,
        text: "Jadwal",
        to: "/jadwal",
      },
      {
        icon: <MessageSquare />,
        text: "Chat",
        to: "/chat",
        alert: true,
      },
    ];
  };

  useEffect(() => {
    if (isLoginPage) {
      setExpanded(false); // Collapse sidebar on login page
    } else {
      setExpanded(true); // Expand sidebar on other pages
    }
  }, [location.pathname, isLoginPage]);

  return (
    <div className="flex">
      {/* Conditionally render Sidebar and HomeHeader based on the current path */}
      {!isLoginPage && (
        <>
          <Sidebar expanded={expanded} setExpanded={setExpanded}>
            <hr className="my-2" />
            {getNavigationItems().map((item, index) => (
              <SidebarItem
                key={index}
                icon={item.icon}
                text={item.text}
                to={item.to}
                active={location.pathname === item.to}
                alert={item.alert}
              />
            ))}
          </Sidebar>
          <HomeHeader expanded={expanded} />
        </>
      )}
      <div
        className={`flex-1 transition-all ${
          isLoginPage ? "" : expanded ? "ml-64" : "ml-24"
        }`}
      >
        <div
          className={`container items-center min-w-full ${
            isLoginPage ? "" : "pt-16"
          } `}
        >
          <Routes>
            <Route path="/" element={<Navigate to="/login" />} />
            <Route path="/home" element={<HomeMain />} />
            <Route
              path="/jadwal"
              element={<SchedulePageWrapper expanded={expanded} />}
            />
            <Route path="/chat" element={<ChatApp />} />
            <Route path="/login" element={<AuthPage />} />

            {/* Admin routes */}
            <Route path="/admin" element={<AdminPage />} />
            <Route path="/admin/users" element={<AdminPage />} />
            <Route path="/admin/announcements" element={<AdminPage />} />
            <Route path="/admin/schedule" element={<AdminPage />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
