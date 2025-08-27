// ChatApp.jsx
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import socket from "../socket";

export default function ChatApp() {
  const [messages, setMessages] = useState([
    { sender: "bot", text: "Hello 👋, I am Gemini AI. How can I help you today?" }
  ]);
  const [input, setInput] = useState("");

  useEffect(() => {

    socket.on("chat-history", (history) => {
    setMessages(history);
  });

  socket.on("ai-response", (data) => {
    setMessages((prev) => [...prev, { sender: "bot", text: data.response }]);
  });

  return () => {
    socket.off("ai-response")
    socket.off("chat-history")
  }
}, []);

  // ✅ Send message to backend
  const sendMessage = async () => {
    if (!input.trim()) return;

    // Add user message to UI
    const newMessage = { sender: "user", text: input };
    setMessages((prev) => [...prev, { sender: "user", text: input }]);
    socket.emit("ai-message", { prompt: input });

    // Clear input
    setInput("");
  };

  // Handle Enter key
  const handleKeyPress = (e) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <div className="flex items-center justify-center h-screen bg-gradient-to-r from-gray-900 via-black to-gray-900">
      <div className="w-full max-w-2xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-6 flex flex-col h-[80vh]">
        
        {/* Chat Window */}
        <div className="flex-1 overflow-y-auto space-y-4 pr-2">
          {messages.map((msg, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className={`p-3 max-w-xs rounded-xl ${
                msg.sender === "user"
                  ? "bg-orange-500 text-white self-end ml-auto"
                  : "bg-gray-200 text-gray-900 self-start"
              }`}
            >
              {msg.text}
            </motion.div>
          ))}
        </div>

        {/* Input Area */}
        <div className="flex mt-4">
          <input
            type="text"
            className="flex-1 p-3 rounded-xl border text-white placeholder:text-white border-gray-300 focus:outline-none focus:ring-2 focus:ring-orange-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
          />
          <button
            onClick={sendMessage}
            className="ml-2 px-4 py-2 bg-orange-600 text-white rounded-xl hover:bg-orange-700 transition-all"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}
