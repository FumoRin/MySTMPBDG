import Sidebar, { SidebarItem } from "./components/sidebar";
import {
  LifebuoyIcon,
  HomeIcon,
  BuildingLibraryIcon,
  CalendarDaysIcon,
  ChatBubbleLeftRightIcon,
  Cog6ToothIcon,
} from "@heroicons/react/24/solid";
function App() {
  return (
    <div>
      <Sidebar>
        <hr className="mb-3" />
        <SidebarItem icon={<HomeIcon />} text="Home" active />
        <SidebarItem icon={<BuildingLibraryIcon />} text="Materi" />
        <SidebarItem icon={<CalendarDaysIcon />} text="Tugas" alert />
        <SidebarItem icon={<ChatBubbleLeftRightIcon />} text="Chat & Forum" />
        <hr className="my-4" />
        <SidebarItem icon={<LifebuoyIcon />} text="Bantuan" />
        <SidebarItem icon={<Cog6ToothIcon />} text="Pengaturan" />
      </Sidebar>
    </div>
  );
}

export default App;
