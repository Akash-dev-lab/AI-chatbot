import "../styles/NewChatModal.css";

const NewChatModal = ({ isOpen, title, setTitle, onClose, onCreate }) => {
  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h3>Create New Chat</h3>
        <input
          type="text"
          placeholder="Enter chat title..."
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={onCreate} disabled={!title.trim()}>
            Create
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewChatModal;
