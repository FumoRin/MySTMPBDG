import clock from "./src/clock";

export function HomeHeader({ expanded }: { expanded: boolean }) {
  // Get user data from localStorage and parse it
  const userData = JSON.parse(localStorage.getItem("user") || "{}");
  const userName = userData.name || "User"; // Fallback to 'User' if name is not found

  return (
    <div
      className={`fixed top-0 right-0 py-1 bg-calypsoDark-300 z-10 transition-all ${
        expanded ? "left-64" : "left-24"
      }`}
    >
      <header className="flex justify-between p-4">
        <h1 className="text-2xl font-bold text-gray-200">
          Selamat Datang, {userName}
        </h1>
        <div className="ml-auto text-gray-200">{clock()}</div>
      </header>
    </div>
  );
}

export default HomeHeader;
