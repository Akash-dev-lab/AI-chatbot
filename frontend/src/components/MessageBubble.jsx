import "../styles/MessageBubble.css";

const MessageBubble = ({ text, sender, typing }) => {
  return (
    <div className={`message-bubble ${sender}`}>
      {typing ? (
        <span className="typing">
          <span></span><span></span><span></span>
        </span>
      ) : (
        text
      )}
    </div>
  );
};

export default MessageBubble;
