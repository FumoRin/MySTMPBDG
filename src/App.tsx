import HomeHeader from "./components/home/homeHeader";
import HomeMain from "./components/home/homeMain";
import Sidebar, { SidebarItem } from "./components/sidebar";
import { useState } from "react";
import {
  HomeIcon,
  BuildingLibraryIcon,
  LifebuoyIcon,
  Cog6ToothIcon,
  ChatBubbleLeftRightIcon,
  CalendarIcon,
  DocumentIcon,
} from "@heroicons/react/24/solid";

function App() {
  const [expanded, setExpanded] = useState(true); // State to manage sidebar expansion

  return (
    <>
      <div className="flex">
        <Sidebar expanded={expanded} setExpanded={setExpanded}>
          <hr className="my-2" />
          <SidebarItem icon={<HomeIcon />} text="Home" active={true} />
          <SidebarItem icon={<BuildingLibraryIcon />} text="Materi" />
          <SidebarItem icon={<DocumentIcon />} text="Tugas" />
          <SidebarItem icon={<CalendarIcon />} text="Jadwal" />
          <SidebarItem icon={<ChatBubbleLeftRightIcon />} text="Chat" alert />
          <hr className="my-3" />
          <SidebarItem icon={<LifebuoyIcon />} text="Bantuan" />
          <SidebarItem icon={<Cog6ToothIcon />} text="Settings" />
        </Sidebar>
        <div
          className={`flex-1 transition-all ${expanded ? "ml-64" : "ml-24"}`}
        >
          {" "}
          {/* Adjust margin based on sidebar state */}
          <HomeHeader />
          <HomeMain />
        </div>
      </div>
    </>
  );
}

export default App;
