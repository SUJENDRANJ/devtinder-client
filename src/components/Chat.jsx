import React, { useState } from "react";

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      id: 1,
      text: "Hi there!",
      sender: "other",
      avatar: "https://i.pravatar.cc/40?img=3",
    },
    {
      id: 2,
      text: "Hello!",
      sender: "me",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
      id: 2,
      text: "Hello!",
      sender: "me",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
    {
      id: 2,
      text: "Hello!",
      sender: "me",
      avatar: "https://i.pravatar.cc/40?img=5",
    },
  ]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now(),
        text: input,
        sender: "me",
        avatar: "https://i.pravatar.cc/40?img=5",
      },
    ]);
    setInput("");
  };

  return (
    <div className="flex h-[550px]  px-40">
      {/* Chat Window */}
      <div className="flex-1 flex flex-col w-1/3 px-10">
        {/* Messages */}
        <div className="flex-1 overflow-y-auto px-20 py-10 space-y-4 bg-gray-50">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-end ${
                msg.sender === "me" ? "justify-end" : "justify-start"
              }`}
            >
              {msg.sender === "other" && (
                <img
                  src={msg.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full mr-2"
                />
              )}
              <div
                className={`max-w-xs p-2 rounded ${
                  msg.sender === "me"
                    ? "bg-blue-500 text-white ml-2"
                    : "bg-gray-200 text-gray-800"
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === "me" && (
                <img
                  src={msg.avatar}
                  alt="avatar"
                  className="w-8 h-8 rounded-full ml-2"
                />
              )}
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-4 border-t border-gray-300 flex gap-2">
          <input
            type="text"
            className="flex-1 border rounded px-4 py-2 focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
          />
          <button
            onClick={handleSend}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
