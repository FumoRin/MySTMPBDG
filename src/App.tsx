import HomeHeader from "./components/home/homeHeader";
import HomeMain from "./components/home/homeMain";
import Sidebar, { SidebarItem } from "./components/sidebar";
import ChatApp from "./components/chatapp/chatApp";
import SchedulePage from "./components/schedule/schedulePage";
import AuthPage from "./components/auth/authPage";

import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
  Navigate,
} from "react-router-dom"; // Ensure correct import
import { useState, useEffect } from "react";
import { Home, MessageSquare, Calendar } from "lucide-react";

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
            <SidebarItem
              icon={<Home />}
              text="Home"
              to="/home"
              active={location.pathname === "/home"}
            />
            <SidebarItem
              icon={<Calendar />}
              text="Jadwal"
              to="/jadwal"
              active={location.pathname === "/jadwal"}
            />
            <SidebarItem
              icon={<MessageSquare />}
              text="Chat"
              to="/chat"
              active={location.pathname === "/chat"}
              alert
            />
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
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
