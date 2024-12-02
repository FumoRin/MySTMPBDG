import { Link } from "react-router-dom";

// Define the props interface
interface HeaderProps {
  heading?: string; // Optional string
  paragraph: string; // Required string
  linkName: string; // Required string
  linkUrl?: string; // Optional string, defaults to "#"
}

export default function Header({
  heading,
  paragraph,
  linkName,
  linkUrl = "#",
}: HeaderProps) {
  return (
    <div className="pt-32">
      <div className="flex justify-center">
        <img
          alt=""
          className="h-14 w-14"
          src="D:\SMKN 1 CIMAHI\SIJA\PKK2\MySTMPBDG_-_Frontend\src\assets\1.svg"
        />
      </div>
      <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
        {heading}
      </h2>
      <p className=" text-center text-sm text-gray-700 mt-5">
        {paragraph}{" "}
        <Link
          to={linkUrl}
          className="font-medium text-calypsoLight-400 hover:text-calypsoLight-200"
        >
          {linkName}
        </Link>
      </p>
    </div>
  );
}
