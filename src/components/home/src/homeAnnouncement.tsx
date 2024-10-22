// AnnouncementCard.tsx
import React from "react";
import { Calendar, Clock, MapPin, Info } from "lucide-react";

interface Announcement {
  title: string;
  description: string;
  date: string;
  time: string;
  location: string;
  details: string;
  poster: {
    name: string;
    role: string; // e.g. "School Council", "Teacher Council", etc.
  };
}

const AnnouncementCard: React.FC<Announcement> = ({
  title,
  description,
  date,
  time,
  location,
  details,
  poster,
}) => {
  return (
    <div className="bg-white rounded-lg shadow-md p-4 h-full flex flex-col">
      <h2 className="text-lg font-bold">{title}</h2>
      <p className="text-gray-600 flex-grow">{description}</p>
      <div className="mt-4">
        <div className="flex justify-between mb-2">
          <p className="text-gray-600 flex items-center">
            <Calendar className="mr-2" size={16} /> Date: {date}
          </p>
          <p className="text-gray-600 flex items-center">
            <Clock className="mr-2" size={16} /> Time: {time}
          </p>
        </div>
        <div className="flex justify-between mb-2">
          <p className="text-gray-600 flex items-center">
            <MapPin className="mr-2" size={16} /> Location: {location}
          </p>
          <p className="text-gray-600 flex items-center">
            <Info className="mr-2" size={16} /> Details: {details}
          </p>
        </div>
      </div>
      <div className="flex items-center mt-2">
        <p className="text-gray-600">Posted by:</p>
        <p className="text-gray-600 ml-2">
          {poster.name} ({poster.role})
        </p>
      </div>
    </div>
  );
};

export default AnnouncementCard;
