import React, { useState } from "react";
import { Send, Paperclip, Plus, ArrowLeft } from "lucide-react";

interface Chat {
  id: number;
  name: string;
  lastMessage: string;
}

interface Message {
  id: number;
  text: string;
  sender: "me" | "them";
  time: string;
}

interface ChatListProps {
  chats: Chat[];
  setActiveChat: (chat: Chat) => void;
  onAddNewChat: () => void;
}

const ChatList: React.FC<ChatListProps> = ({
  chats,
  setActiveChat,
  onAddNewChat,
}) => (
  <div className="w-1/4 bg-gray-200 p-4 overflow-y-auto">
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-xl font-bold">Chats</h2>
      <button
        onClick={onAddNewChat}
        className="p-2 bg-blue-600 text-white rounded-full"
      >
        <Plus size={24} />
      </button>
    </div>
    {chats.map((chat) => (
      <div
        key={chat.id}
        onClick={() => setActiveChat(chat)}
        className="flex items-center p-3 mb-2 bg-white rounded-lg cursor-pointer hover:bg-gray-100"
      >
        <div className="w-12 h-12 bg-gray-300 rounded-full mr-3"></div>
        <div>
          <h3 className="font-semibold">{chat.name}</h3>
          <p className="text-sm text-gray-600">{chat.lastMessage}</p>
        </div>
      </div>
    ))}
  </div>
);

interface ChatWindowProps {
  chat: Chat;
  messages: Message[];
  inputMessage: string;
  setInputMessage: (message: string) => void;
  handleSendMessage: (e: React.FormEvent) => void;
}

const ChatWindow: React.FC<ChatWindowProps> = ({
  chat,
  messages,
  inputMessage,
  setInputMessage,
  handleSendMessage,
}) => (
  <div className="flex-1 flex flex-col">
    <div className="bg-blue-600 text-white p-4 flex items-center">
      <ArrowLeft size={24} className="mr-3 cursor-pointer" />
      <h1 className="text-xl font-bold">{chat.name}</h1>
    </div>
    <div className="flex-1 overflow-y-auto p-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex ${
            message.sender === "me" ? "justify-end" : "justify-start"
          } mb-4`}
        >
          <div
            className={`rounded-lg p-3 max-w-xs lg:max-w-md ${
              message.sender === "me"
                ? "bg-blue-600 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
          >
            <p>{message.text}</p>
            <p className="text-xs mt-1 text-gray-200">{message.time}</p>
          </div>
        </div>
      ))}
    </div>
    <form onSubmit={handleSendMessage} className="bg-gray-200 p-4 flex">
      <button type="button" className="p-2 text-gray-600">
        <Paperclip size={24} />
      </button>
      <input
        type="text"
        value={inputMessage}
        onChange={(e) => setInputMessage(e.target.value)}
        placeholder="Type a message"
        className="flex-1 bg-white rounded-full px-4 py-2 mx-2 focus:outline-none"
      />
      <button type="submit" className="p-2 bg-blue-600 text-white rounded-full">
        <Send size={24} />
      </button>
    </form>
  </div>
);

const ChatApp: React.FC = () => {
  const [chats, setChats] = useState<Chat[]>([
    { id: 1, name: "Alice", lastMessage: "See you tomorrow!" },
    { id: 2, name: "Bob", lastMessage: "How's the project going?" },
    { id: 3, name: "Charlie", lastMessage: "Let's catch up soon" },
  ]);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState<string>("");

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputMessage.trim() !== "" && activeChat) {
      const newMessage: Message = {
        id: messages.length + 1,
        text: inputMessage,
        sender: "me",
        time: new Date().toLocaleTimeString([], {
          hour: "2-digit",
          minute: "2-digit",
        }),
      };
      setMessages([...messages, newMessage]);
      setInputMessage("");

      // Update last message in chat list
      setChats(
        chats.map((chat) =>
          chat.id === activeChat.id
            ? { ...chat, lastMessage: inputMessage }
            : chat
        )
      );
    }
  };

  const handleAddNewChat = () => {
    const newChatName = prompt("Enter the name for the new chat:");
    if (newChatName) {
      const newChat: Chat = {
        id: chats.length + 1,
        name: newChatName,
        lastMessage: "New chat created",
      };
      setChats([...chats, newChat]);
    }
  };

  return (
    <div className="h-full flex bg-gray-100">
      <ChatList
        chats={chats}
        setActiveChat={setActiveChat}
        onAddNewChat={handleAddNewChat}
      />
      {activeChat ? (
        <ChatWindow
          chat={activeChat}
          messages={messages}
          inputMessage={inputMessage}
          setInputMessage={setInputMessage}
          handleSendMessage={handleSendMessage}
        />
      ) : (
        <div className="flex-1 flex items-center justify-center bg-gray-50">
          <p className="text-xl text-gray-500">
            Select a chat or start a new conversation
          </p>
        </div>
      )}
    </div>
  );
};

export default ChatApp;
