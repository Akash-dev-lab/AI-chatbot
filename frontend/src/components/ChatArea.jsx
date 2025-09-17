import { useState, useEffect, useRef } from "react";
import io from "socket.io-client";
import "../styles/ChatArea.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchMessages, addMessage } from "../features/messages/messageSlice";
import { FaPlus, FaImage } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import TypingEffect from "../ui/TypingEffect";

const ChatArea = () => {
  const dispatch = useDispatch();
  const { items: messagesByChat, loading } = useSelector((state) => state.messages);
  const { activeChatId: chatId, list } = useSelector((state) => state.chats);
  const user = useSelector((state) => state.user);
  const activeChat = chatId ? list.find((chat) => chat._id === chatId) : null;
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [showOptions, setShowOptions] = useState(false);
  const optionsRef = useRef(null);
  const fileInputRef = useRef(null);
  const socketRef = useRef(null);
  const messagesEndRef = useRef(null);
  const [previewImage, setPreviewImage] = useState(null);


  useEffect(() => {
    socketRef.current = io("https://ai-chatbot-1-qxr6.onrender.com", { withCredentials: true });

    socketRef.current.on("ai-response", (data) => {
      dispatch(addMessage({ chatId: data.chat, content: data.content, role: "model", isNew: true }));
      setIsTyping(false);
    });

    return () => {
      socketRef.current.disconnect();
    };
  }, [dispatch]);


  useEffect(() => {
    if (chatId) {
      dispatch(fetchMessages(chatId));
    }
  }, [chatId, dispatch]);


  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messagesByChat, chatId]);


  useEffect(() => {
    const handleClickOutside = (e) => {
      if (optionsRef.current && !optionsRef.current.contains(e.target)) {
        setShowOptions(false);
      }
    };
    if (showOptions) document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showOptions]);

  const handleSend = () => {
    if (!input.trim() || !chatId) return;


    dispatch(addMessage({ chatId, content: input, role: "user" }));
    setIsTyping(true);
    socketRef.current.emit("ai-message", { chat: chatId, content: input });
    setInput("");
  };


  const toggleOptions = () => setShowOptions((s) => !s);

  const handleOpenFilePicker = () => {
    setShowOptions(false);
    fileInputRef.current?.click();
  };

  function toBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  }


  const handleFileSelected = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const base64 = await toBase64(file);

      dispatch(
        addMessage({
          chatId,
          content: "[Image sent]",
          role: "user",
          imageUrl: base64,
        })
      );

      socketRef.current.emit("ai-message", {
        chat: chatId,
        content: "",
        imageUrl: base64,
      });

    } catch (err) {
      console.error("Image handling failed:", err);
    }

    e.target.value = "";
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
      <div className="chat-header">
        {activeChat ? `${activeChat.title}✨` : "No chat selected"}
      </div>

      <div className="messages">
        {loading ? (
          <p>Loading...</p>
        ) : (
          messages.map((msg, idx) => (
            <div
              key={msg._id || idx}
              className={`chat-message ${msg.role === "user" ? "user-msg" : "bot-msg"}`}
            >
              {msg.role === "model" ? (
                <>
                  <img src="/bot.png" alt="Bot" className="avatar w-50 h-50" />
                  <div className="bubble bot-bubble">
                    {msg.isNew ? (
                      <TypingEffect text={msg.content} speed={25} />
                    ) : (
                      <div className="whitespace-pre-line">{msg.content}</div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {msg.imageUrl ? (
                    <img
                      src={msg.imageUrl}
                      alt="sent"
                      className="max-w-[200px] rounded-lg shadow-md cursor-pointer transition-transform duration-300 hover:scale-105"
                      onClick={() => setPreviewImage(msg.imageUrl)}
                    />
                  ) : (
                    <p className="bubble user-bubble">{msg.content}</p>
                  )}

                  {previewImage && (
                    <div
                      className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
                      onClick={() => setPreviewImage(null)}
                    >
                      <img
                        src={previewImage}
                        alt="preview"
                        className="max-h-[90%] max-w-[90%] rounded-xl shadow-2xl transform scale-90 animate-zoomIn"
                      />
                    </div>
                  )}

                  <img src={user?.profilePic} alt="User" className="avatar" />
                </>
              )}
            </div>
          ))
        )}

        {isTyping && (
          <div className="typing-indicator">
            <div className="gemini-loader">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>


      {chatId && (
        <div className="chat-input" style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <div style={{ position: "relative" }} ref={optionsRef}>
            <button
              onClick={toggleOptions}
              aria-label="Open options"
              style={{
                width: 40,
                height: 40,
                borderRadius: 8,
                border: "none",
                background: "transparent",
                color: "white",
                fontSize: 22,
                cursor: "pointer",
              }}
            >
              <FaPlus />
            </button>

            <AnimatePresence>
              {showOptions && (
                <motion.div
                  key="options"
                  initial={{ opacity: 0, y: 30, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 30, scale: 0.95 }}
                  transition={{ duration: 0.35, ease: "easeOut" }}
                  style={{
                    position: "absolute",
                    bottom: 60,
                    left: 0,
                    background: "#222",
                    color: "white",
                    borderRadius: 10,
                    padding: "10px 12px",
                    boxShadow: "0 6px 20px rgba(0,0,0,0.6)",
                    zIndex: 2000,
                    minWidth: 160,
                  }}
                >
                  <div
                    onClick={handleOpenFilePicker}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 12,
                      width: "150px",
                      cursor: "pointer",
                    }}
                  >
                    <FaImage className="text-xl" />
                    <span className="text-lg">Upload Image</span>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            style={{ display: "none" }}
            onChange={handleFileSelected}
          />

          <input
            type="text"
            placeholder="Type a message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSend()}
            disabled={isTyping}
            style={{
              flex: 1,
              padding: "12px 16px",
              borderRadius: 24,
              background: "rgba(30,30,30,0.9)",
              color: "white",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          />

          <button
            onClick={handleSend}
            disabled={isTyping}
            style={{
              marginLeft: 8,
              width: 44,
              height: 44,
              borderRadius: 12,
              border: "none",
              background: "transparent",
              color: "white",
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ➤
          </button>
        </div>
      )}
    </div>
  );
};

export default ChatArea;
