import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../styles/ChatArea.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, addMessage } from "../features/messages/messageSlice";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { items: messagesByChat, loading } = useSelector((state) => state.messages);
  const { activeChatId: chatId } = useSelector((state) => state.chats);
  const user = useSelector((state) => state.user);

  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);

  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);

  // ✅ Connect socket on mount
  useEffect(() => {
    socketRef.current = io("http://localhost:3000", { withCredentials: true });

    // Listen for AI response
    socketRef.current.on("ai-response", (data) => {
      dispatch(addMessage({ chatId: data.chat, content: data.content, role: "model" }));
      setIsTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [dispatch]);

  // ✅ Fetch history when activeChatId changes
  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
    }
  }, [chatId, dispatch]);

  // ✅ Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByChat, chatId]);

  const handleSend = () => {
    if (!input.trim() || !chatId) return;

    // Show immediately in Redux (optimistic UI)
    dispatch(addMessage({ chatId, content: input, role: "user" }));

    setIsTyping(true);

    // Emit to server
    socketRef.current.emit("ai-message", { chat: chatId, content: input });

    setInput("");
  };

  const messages = messagesByChat[chatId] || [];

  if (!chatId) {
    return (
      <div className="flex items-center justify-center flex-col gap-5 h-full w-full px-4">
      <h2
        className="welcome-title"
        style={{
        fontSize: "clamp(2rem, 8vw, 6rem)",
        textAlign: "center",
        wordBreak: "break-word",
        }}
      >
        Welcome, {user?.name || "Guest"}
      </h2>
      <p
        className="welcome-desc"
        style={{
        fontSize: "clamp(1rem, 3vw, 2.5rem)",
        fontWeight: 200,
        textAlign: "center",
        }}
      >
        I am Your Personal AI Assistent <br />
        <span
        style={{
          fontSize: "clamp(0.8rem, 2vw, 1.25rem)",
          display: "block",
          marginTop: "0.5em",
        }}
        >
        Powered by Gemini-2.5-flash
        </span>
      </p>
      </div>
    );
  }

  return (
    <div className="chat-area">
      <div className="messages">
          {loading ? (
            <p>Loading...</p>
          ) : (
            messages.map((msg, idx) => (
              <div key={msg._id || idx} className={`message ${msg.role}`}>
                <strong>{msg.role}:</strong> {msg.content}
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
      </div>

      {chatId && (
        <div className="chat-input">
          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
          />
          <button onClick={handleSend} disabled={isTyping}>
            ➤
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
