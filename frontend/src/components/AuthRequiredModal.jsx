import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { X } from "lucide-react";

const AuthRequiredModal = ({ isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center z-9999 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="flex flex-col bg-white/10 h-96 justify-center gap-20 backdrop-blur-lg border border-white/20 p-6 rounded-2xl shadow-2xl w-[90%] max-w-md text-center text-white"
      >
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-300 hover:text-white transition"
        >
          <X size={20} />
        </button>

        {/* Message */}
        <h2 className="text-3xl font-semibold mb-2">Authentication Required</h2>
        {/* <div className="w-70"> */}
          <p className="text-gray-200 text-lg">
          You are not logged in.<br /> Please login or signup to continue.
        </p>
        {/* </div> */}

        {/* Buttons */}
        <div className="flex justify-center gap-20">
          <button
            onClick={() => navigate("/login")}
            className="w-30 h-10 rounded-xl cursor-pointer bg-gradient-to-r from-blue-500 to-indigo-500 text-white font-medium shadow-lg hover:opacity-90 transition"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="w-30 h-10 cursor-pointer rounded-xl bg-gradient-to-r from-pink-500 to-purple-500 text-white font-medium shadow-lg hover:opacity-90 transition"
          >
            Signup
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AuthRequiredModal;
