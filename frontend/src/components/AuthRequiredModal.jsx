import { useNavigate } from "react-router-dom";
import "../styles/AuthRequiredModal.css"; // optional styling

const AuthRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <p className="auth-message">
          You are not logged in. Please register or signup.
        </p>
        <div className="auth-buttons">
          <button onClick={() => navigate("/login")}>Login</button>
          <button onClick={() => navigate("/register")}>Signup</button>
        </div>
        <span className="close-btn" onClick={onClose}>✕</span>
      </div>
    </div>
  );
};

export default AuthRequiredModal;
