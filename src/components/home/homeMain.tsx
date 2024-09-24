export default function HomeMain() {
  return (
    <div className="flex h-screen m-4">
      {/* Main Content Section */}
      <div className="flex-1 flex flex-col h-full">
        {/* Overview Section */}
        <div className="bg-blue-600 text-center text-white p-4 rounded-lg">
          <h1>Overview Informasi Untukmu Hari Ini</h1>
        </div>

        {/* Preview Jadwal Section */}
        <div className="flex-1 bg-gray-200 p-4 mt-2 rounded-lg">
          <h2>Jadwal Pelajaran</h2>
          <hr className="my-2" />
          <div className="bg-blue-100 h-60 rounded-lg"></div>{" "}
          {/* Placeholder for content */}
        </div>

        {/* Pengumuman Section */}
        <div className="flex-1 bg-gray-200 p-4 mt-2 rounded-lg">
          <h2>Pengumuman</h2>
          <hr className="my-2" />
          <div className="bg-red-100 h-32 rounded-lg"></div>{" "}
          {/* Placeholder for content */}
        </div>
      </div>

      {/* Chat Section */}
      <div className=" bg-gray-200 w-1/3 p-4 ml-2 flex flex-col rounded-lg">
        <h2>Chat / Percakapan</h2>
        <div className="bg-blue-100 h-full rounded-lg overflow-auto">
          {/* Placeholder for chat content */}
        </div>
      </div>
    </div>
  );
}
