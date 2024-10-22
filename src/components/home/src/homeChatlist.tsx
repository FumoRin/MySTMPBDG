import React from "react";

interface ChatItem {
  name: string;
  lastMessage: string;
  timestamp: string;
}

interface ChatListProps {
  chatItems: ChatItem[];
}

const ChatList: React.FC<ChatListProps> = ({ chatItems }) => {
  return (
    <div className="chat-list bg-white h-full flex flex-col rounded-lg">
      {chatItems.map((item, index) => (
        <div
          key={index}
          className="chat-item flex items-center p-4 border-b border-gray-200 hover:bg-gray-50 cursor-pointer rounded-lg"
        >
          <img
            src={`https://ui-avatars.com/api/?name=${item.name.replace(
              " ",
              "+"
            )}&size=40&background=random`}
            className="w-12 h-12 rounded-full mr-4"
            alt={item.name}
          />
          <div className="flex-grow">
            <div className="flex justify-between items-baseline">
              <div className="chat-title font-semibold text-gray-900">
                {item.name}
              </div>
              <div className="chat-timestamp text-xs text-gray-500">
                {item.timestamp}
              </div>
            </div>
            <div className="chat-last-message text-sm text-gray-600 mt-1 truncate text-left">
              {item.lastMessage}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ChatList;
