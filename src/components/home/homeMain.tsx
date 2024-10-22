import AnnouncementCard from "./src/homeAnnouncement";
import ChatList from "./src/homeChatlist";

export default function HomeMain() {
  const chatItems = [
    {
      name: "John Doe",
      lastMessage: "Hello, how are you?",
      timestamp: "10:45 AM",
    },
    {
      name: "Jane Doe",
      lastMessage: "I'm good, thanks!",
      timestamp: "11:05 AM",
    },
    // Add more chat items as needed
  ];

  return (
    <div className="flex h-screen m-4">
      {/* Main Content Section */}
      <div className="flex-1 flex flex-col h-full">
        {/* Overview Section */}
        <div className="bg-blue-600 text-center text-white p-4 rounded-lg">
          <h1>Overview Informasi Untukmu Hari Ini</h1>
        </div>

        {/* Preview Jadwal Section */}
        <div className="flex-1 bg-gray-200 p-4 mt-2 rounded-lg text-center flex flex-col">
          <h2>Jadwal Pelajaran</h2>
          <hr className="my-2" />
          <div className="bg-blue-700 flex-grow rounded-lg mt-1 overflow-hidden flex flex-col">
            <div className="overflow-auto flex-grow">
              <table className="w-full h-full bg-white">
                <thead className="sticky top-0 bg-white">
                  <tr>
                    <th className="py-2 px-4 border-b">Mata Pelajaran</th>
                    <th className="py-2 px-4 border-b">Waktu</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="py-2 px-4 border-b">Bahasa Inggris</td>
                    <td className="py-2 px-4 border-b">06:45 - 08:00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Matematika</td>
                    <td className="py-2 px-4 border-b">08:00 - 09:30</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Bahasa Indonesia</td>
                    <td className="py-2 px-4 border-b">09:45 - 11:15</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">Sejarah</td>
                    <td className="py-2 px-4 border-b">12:30 - 14:00</td>
                  </tr>
                  <tr>
                    <td className="py-2 px-4 border-b">PPKN</td>
                    <td className="py-2 px-4 border-b">14:00 - 15:15</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Pengumuman Section */}
        <div className="flex-1 bg-gray-200 p-4 mt-2 rounded-lg text-center flex flex-col">
          <h2>Pengumuman</h2>
          <hr className="my-2" />
          <div className="bg-blue-700 flex-grow rounded-lg mt-1 overflow-hidden">
            <AnnouncementCard
              title="School Council Meeting"
              description="Join us for our monthly school council meeting."
              date="2024-09-28"
              time="3:00 PM"
              location="School Auditorium"
              details="All students and teachers are welcome to attend."
              poster={{
                name: "John Doe",
                role: "School Council President",
              }}
            />
          </div>
        </div>
      </div>

      {/* Chat Section */}
      <div className="bg-gray-200 w-1/3 p-4 ml-2 flex flex-col text-center rounded-lg">
        <h2>Chat / Percakapan</h2>
        <div className="bg-blue-100 rounded-lg flex-grow mt-2">
          <ChatList chatItems={chatItems} />
        </div>
      </div>
    </div>
  );
}
