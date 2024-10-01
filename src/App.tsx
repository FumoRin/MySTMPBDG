import HomeHeader from "./components/home/homeHeader";
import HomeMain from "./components/home/homeMain";
import Sidebar, { SidebarItem } from "./components/sidebar";
import ChatApp from "./components/chatapp/chatApp";
import SchedulePage from "./components/schedule/schedulePage";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useLocation,
} from "react-router-dom"; // Ensure correct import
import { useState } from "react";
import {
  Home,
  Library,
  LifeBuoy,
  Settings,
  MessageSquare,
  Calendar,
  FileText,
} from "lucide-react";

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

  return (
    <div className="flex">
      <Sidebar expanded={expanded} setExpanded={setExpanded}>
        <hr className="my-2" />
        <SidebarItem
          icon={<Home />}
          text="Home"
          to="/"
          active={location.pathname === "/"}
        />
        <SidebarItem
          icon={<Library />}
          text="Materi"
          to="/materi"
          active={location.pathname === "/materi"}
        />
        <SidebarItem
          icon={<FileText />}
          text="Tugas"
          to="/tugas"
          active={location.pathname === "/tugas"}
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
      </Sidebar>
      <div className={`flex-1 transition-all ${expanded ? "ml-64" : "ml-24"}`}>
        <HomeHeader expanded={expanded} />
        <div className="pt-16">
          <Routes>
            <Route path="/" element={<HomeMain />} />
            <Route path="/jadwal" element={<SchedulePage />} />
            <Route path="/chat" element={<ChatApp />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default App;
