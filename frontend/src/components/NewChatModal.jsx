import "../styles/NewChatModal.css";

const NewChatModal = ({ isOpen, title, setTitle, onClose, onCreate }) => {
  if (!isOpen) return null;

  return (
    <>
      <div className="modal-backdrop" onClick={onClose} />

      <div className="modal">
        <h2 className="modal-title">✨ Start a New Chat</h2>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter chat title..."
          className="modal-input"
        />
        <div className="modal-actions">
          <button className="btn cancel" onClick={onClose}>
            Cancel
          </button>
          <button className="btn create" onClick={onCreate} disabled={!title.trim()}>
            Create 🚀
          </button>
        </div>
      </div>
    </>
  );
};

export default NewChatModal;
