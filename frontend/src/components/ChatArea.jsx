// src/components/ChatArea.jsx
import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../styles/ChatArea.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, sendMessage, addMessage } from "../features/messages/messageSlice";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { items: messagesByChat, loading } = useSelector((state) => state.messages);
  const { activeChatId: chatId } = useSelector((state) => state.chats);
  const messages = messagesByChat[chatId] || [];
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ Setup Socket once
  useEffect(() => {
    socketRef.current = io("http://localhost:3000", { withCredentials: true });

    socketRef.current.on("ai-response", (data) => {
      dispatch(addMessage({chatId: data.chat, ...data, role: "model" }));
      setIsTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [dispatch]);

  // ✅ Fetch messages when chatId changes
  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
    }
  }, [chatId, dispatch]);

  // ✅ Auto-scroll on new messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim() || !chatId) return;

    setIsTyping(true);
    dispatch(sendMessage({ chatId, content: input, role: "user" }));

    socketRef.current.emit("ai-message", { chat: chatId, content: input });

    setInput("");
  };

  // if (!chatId) {
  //   return <div className="chat-area">Select or create a chat to start messaging</div>;
  // }

  return (
    <div className="chat-area">
      <div className="messages">
        {loading ? (
          <p>Loading...</p>
        ) : (
          messages.map((msg) => (
            <div key={msg._id || Math.random()} className={`message ${msg.role}`}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Box */}
      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message.."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
          disabled={isTyping}
        />
        <button onClick={handleSend} disabled={isTyping}>
          ➤
        </button>
      </div>
    </div>
  );
};

export default ChatArea;
