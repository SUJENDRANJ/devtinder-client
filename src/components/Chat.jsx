import { useState, useEffect, useRef } from "react";
import { createSocketConnection } from "../utils/socket";
import { useAuth } from "../AuthContext";

const API_BASE =
  location.hostname === "localhost"
    ? "http://localhost:5000"
    : "https://devtinder-server-v33b.onrender.com";

const Chat = ({ targetUser }) => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const socketRef = useRef(null);
  const scrollRef = useRef(null);

  const userId = user?._id;

  // Fetch chat history on mount
  useEffect(() => {
    if (!targetUser?._id) return;

    const fetchHistory = async () => {
      try {
        const res = await fetch(`${API_BASE}/chat`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ targetUserId: targetUser._id }),
        });
        if (!res.ok) throw new Error(await res.text());
        const data = await res.json();

        if (data?.data?.messages) {
          const formattedMessages = data.data.messages.map((msg) => ({
            ...msg,
            sender:
              msg.senderId?.firstName ||
              (msg.senderId === userId
                ? user?.firstName
                : targetUser?.firstName),
          }));
          setMessages(formattedMessages);
        }
      } catch (err) {
        console.error("Error fetching chat history:", err);
      }
    };

    fetchHistory();
  }, [targetUser?._id, userId, user?.firstName, targetUser?.firstName]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  useEffect(() => {
    if (!userId) return;

    if (!socketRef.current) {
      socketRef.current = createSocketConnection();
    }

    const socket = socketRef.current;

    socket.emit("joinChat", {
      firstName: user?.firstName,
      userId,
      targetUserId: targetUser._id,
    });

    const handleMessageReceived = (msg) => {
      setMessages((prev) => {
        // Avoid duplication if the message already exists (fallback check)
        if (prev.find((m) => m._id === msg._id)) return prev;
        return [...prev, { ...msg, sender: msg.firstName, id: msg._id }];
      });
    };

    socket.on("messageReceived", handleMessageReceived);

    return () => {
      socket.off("messageReceived", handleMessageReceived);
    };
  }, [userId, targetUser?._id, user?.firstName]);

  const handleSend = () => {
    if (!input.trim() || !socketRef.current) return;
    const socket = socketRef.current;

    socket.emit("sendMessage", {
      firstName: user?.firstName,
      lastName: user?.lastName,
      userId,
      targetUserId: targetUser._id,
      text: input,
    });

    setInput("");
  };

  return (
    <div className="flex h-[550px] px-10 md:px-40 pb-10">
      {/* Chat Window */}
      <div className="flex-1 flex flex-col px-4 md:px-10 bg-white shadow-lg rounded-2xl overflow-hidden border">
        <h1 className="p-5 border-b font-bold text-gray-700 text-lg flex items-center gap-3 bg-gray-50">
          <div className="w-10 h-10 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm shadow-md">
            {targetUser?.firstName?.[0]}
          </div>
          <span className="flex-1">Chatting with {targetUser?.firstName}</span>
        </h1>
        {/* Messages */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto px-4 py-8 space-y-4 bg-gray-50 scroll-smooth"
        >
          {messages.length === 0 && (
            <div className="flex flex-col items-center justify-center h-full opacity-40">
              <div className="w-16 h-16 bg-gray-200 rounded-full mb-4"></div>
              <p>No messages yet. Say hi!</p>
            </div>
          )}
          {messages.map((msg) => (
            <div
              key={msg._id || msg.id}
              className={`flex items-end ${
                msg.senderId === userId || msg.sender === user?.firstName
                  ? "justify-end"
                  : "justify-start"
              }`}
            >
              <div
                className={`max-w-[75%] p-4 rounded-2xl shadow-sm leading-relaxed ${
                  msg.senderId === userId || msg.sender === user?.firstName
                    ? "bg-blue-600 text-white rounded-br-none"
                    : "bg-white border border-gray-100 text-gray-800 rounded-bl-none"
                }`}
              >
                {msg.text}
              </div>
            </div>
          ))}
        </div>

        {/* Input Box */}
        <div className="p-4 bg-white border-t border-gray-100">
          <div className="flex gap-2 p-1 bg-gray-50 rounded-full border focus-within:ring-2 focus-within:ring-blue-100 focus-within:border-blue-300 transition-all">
            <input
              type="text"
              className="flex-1 bg-transparent px-5 py-2.5 focus:outline-none"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
            />
            <button
              onClick={handleSend}
              className="bg-blue-600 text-white px-8 py-2.5 rounded-full hover:bg-blue-700 font-bold transition-all shadow-md active:scale-95 flex items-center gap-2"
            >
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chat;
