import HomeHeader from "./components/home/homeHeader";
import HomeMain from "./components/home/homeMain";
import Sidebar, { SidebarItem } from "./components/sidebar";
import SchedulePage from "./components/schedule/schedulePage";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"; // Ensure correct import
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
  const [expanded, setExpanded] = useState(true); // State to manage sidebar expansion

  return (
    <Router>
      <div className="flex">
        <Sidebar expanded={expanded} setExpanded={setExpanded}>
          <hr className="my-2" />
          <SidebarItem icon={<Home />} text="Home" to="/" active={true} />
          <SidebarItem icon={<Library />} text="Materi" />
          <SidebarItem icon={<FileText />} text="Tugas" />
          <SidebarItem icon={<Calendar />} text="Jadwal" to="/jadwal" />
          <SidebarItem icon={<MessageSquare />} text="Chat" alert />
          <hr className="my-3" />
          <SidebarItem icon={<LifeBuoy />} text="Bantuan" />
          <SidebarItem icon={<Settings />} text="Settings" />
        </Sidebar>
        <div
          className={`flex-1 transition-all ${expanded ? "ml-64" : "ml-24"}`}
        >
          <HomeHeader expanded={expanded} />
          <div className="pt-16">
            <Routes>
              <Route path="/" element={<HomeMain />} />
              <Route path="/jadwal" element={<SchedulePage />} />
            </Routes>
          </div>
        </div>
      </div>
    </Router>
  );
}

export default App;
