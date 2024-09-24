import clock from "./clock";

export function HomeHeader() {
  return (
    <div className="flex py-1 bg-calypsoDark-300">
      <header className="flex justify-between p-4 w-full">
        <h1 className="text-2xl font-bold text-gray-200">
          Selamat Datang, Dimas Faiz Satria
        </h1>
        <div className="ml-auto text-gray-200">{clock()}</div>
      </header>
    </div>
  );
}

export default HomeHeader;
