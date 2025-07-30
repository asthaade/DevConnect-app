import axios from "axios";
import { format, isToday, isYesterday } from "date-fns";
import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import { BASE_URL } from "../utils/constants";
import { socketConnection } from "../utils/socket";

const Chat = () => {
  const { targetUserId } = useParams();
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const user = useSelector((store) => store.user);
  const userId = user?._id;
  const chatEndRef = useRef(null);
  const socketRef = useRef(null);


  const fetchChatMessages = async () => {
    const chat = await axios.get(BASE_URL + "/chat/" + targetUserId, {
      withCredentials: true,
    });

    const chatMessages = chat?.data?.messages.map((msg) => {
      const { sender, text, createdAt, status } = msg;
      return {
        firstName: sender?.firstName,
        text,
        status,
        createdAt,
      };
    });
    setMessages(chatMessages);
  };

  useEffect(() => {
    fetchChatMessages();
  }, []);

  useEffect(() => {
  if (!userId) return;
  socketRef.current = socketConnection();

  socketRef.current.emit("joinChat", {
    firstName: user.firstName,
    userId,
    targetUserId,
  });

  socketRef.current.emit("markAsSeen", { userId, targetUserId });

  socketRef.current.on("receiveMessage", ({ firstName, text, createdAt, status }) => {
    setMessages((prev) => [...prev, { firstName, text, createdAt, status }]);
  });

  socketRef.current.on("updateMessageStatus", ({ status }) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.firstName !== user.firstName && msg.status !== "seen"
          ? { ...msg, status: "seen" }
          : msg
      )
    );
  });

  return () => {
    socketRef.current.disconnect();
  };
}, [userId, targetUserId]);


  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const sendMessage = () => {
  const trimmedMessage = newMessage.trim();
  if (!trimmedMessage) return;

  // Use existing socket connection
  socketRef.current.emit("sendMessage", {
    firstName: user.firstName,
    userId,
    targetUserId,
    text: trimmedMessage,
    createdAt: new Date(),
  });

  // Do NOT update setMessages here; handled by "receiveMessage"
  setNewMessage("");
};


  const formatTime = (timestamp) => {
  const date = new Date(timestamp);

  if (!timestamp || isNaN(date.getTime())) return ""; // Safe fallback

  return isToday(date)
    ? format(date, "h:mm a")
    : isYesterday(date)
    ? "Yesterday"
    : format(date, "dd/MM/yyyy h:mm a");
};


  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="min-h-screen bg-teal-50 px-4 pt-24 pb-24"
    >
      <div className="w-full max-w-5xl mx-auto bg-white shadow-xl rounded-xl border border-gray-300 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-6">
  <motion.h1
    className="text-3xl font-semibold text-center text-indigo-800"
    initial={{ opacity: 0, y: -20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.4 }}
  >
    Chat
  </motion.h1>
  <div className="w-full h-[1px] bg-gray-300 mt-3" />
</div>

        {/* Messages */}
        <div className="p-6 bg-white overflow-y-auto flex flex-col gap-5 max-h-[500px] scroll-smooth scrollbar-thin scrollbar-thumb-gray-400 scrollbar-track-gray-200">
          {messages.map((msg, index) => {
            const isCurrentUser = msg.firstName === user.firstName;
            return (
              <motion.div
                key={index}
                className={`flex flex-col ${
                  isCurrentUser ? "items-end" : "items-start"
                }`}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.2 }}
              >
                <div className="text-sm text-gray-500 mb-1">
                  {msg.firstName} • {formatTime(msg.createdAt)}
                </div>
                <div
                  className={`max-w-md px-5 py-3 rounded-xl text-base shadow-md ${
                    isCurrentUser
                      ? "bg-indigo-700 text-white rounded-br-none"
                      : "bg-gray-200 text-gray-800 rounded-bl-none"
                  }`}
                >
                  {msg.text}
                </div>
                {isCurrentUser && (
                  <div className="text-[11px] text-gray-400 mt-1">
                    {msg.status === "seen" ? "Seen" : "Sent"}
                  </div>
                )}
              </motion.div>
            );
          })}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="p-5 border-t bg-gray-50 flex items-center gap-3">
          <input
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="flex-1 border border-gray-400 rounded-full px-5 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-300 bg-white text-base"
            placeholder="Type a message..."
          />
          <button
            onClick={sendMessage}
            disabled={!newMessage.trim()}
            className="px-6 py-2.5 rounded-full bg-blue-600 text-white shadow hover:scale-105 transition-transform disabled:opacity-50 text-base"
          >
            Send
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default Chat;
