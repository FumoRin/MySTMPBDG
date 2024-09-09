import Sidebar, { SidebarItem } from "./components/sidebar";
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
  return (
    <Sidebar>
      <hr className="my-1" />
      <SidebarItem icon={<HomeIcon />} text="Home" active={true} />
      <SidebarItem icon={<BuildingLibraryIcon />} text="Materi" />
      <SidebarItem icon={<DocumentIcon />} text="Tugas" />
      <SidebarItem icon={<CalendarIcon />} text="Jadwal" />
      <SidebarItem icon={<ChatBubbleLeftRightIcon />} text="Chat" />
      <hr className="my-3" />
      <SidebarItem icon={<LifebuoyIcon />} text="Bantuan" />
      <SidebarItem icon={<Cog6ToothIcon />} text="Settings" />
    </Sidebar>
  );
}

export default App;
