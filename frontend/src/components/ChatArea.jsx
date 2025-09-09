import { useState } from "react";
import MessageBubble from "./MessageBubble";
import "../styles/ChatArea.css";

const ChatArea = () => {
  const [messages, setMessages] = useState([
    { text: "Hello 👋, I’m Aurora AI!", sender: "bot" },
    { text: "How can I help you today?", sender: "bot" },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const newMessage = { text: input, sender: "user" };
    setMessages([...messages, newMessage]);

    // Dummy bot reply with delay
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { text: "🤖 Thinking...", sender: "bot", typing: true },
      ]);

      setTimeout(() => {
        setMessages((prev) =>
          prev.map((msg, i) =>
            i === prev.length - 1
              ? { text: "Here’s a dummy AI response ✨", sender: "bot" }
              : msg
          )
        );
      }, 1500);
    }, 600);

    setInput("");
  };

  return (
    <div className="chat-area">
      <div className="messages">
        {messages.map((msg, i) => (
          <MessageBubble key={i} text={msg.text} sender={msg.sender} typing={msg.typing} />
        ))}
      </div>

      <div className="chat-input">
        <input
          type="text"
          placeholder="Type a message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <button onClick={handleSend}>➤</button>
      </div>
    </div>
  );
};

export default ChatArea;
