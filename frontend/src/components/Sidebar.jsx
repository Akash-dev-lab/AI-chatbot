import "../styles/Sidebar.css";
import { FaPlus, FaSearch, FaBook, FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/sidebar/sidebarSlice";
import { fetchChats, createChat as createChatThunk } from "../features/chats/chatsSlice";
import { useState, useEffect } from "react";
import NewChatModal from "./NewChatModal";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.sidebar);
  const user = useSelector((state) => state.user);
  const { chatList = [], loading, error } = useSelector((state) => state.chats || {});

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");

  // Open New Chat Modal
  const handleNewChat = () => setIsModalOpen(true);

  // Create new chat and update Redux automatically
  const handleCreateChat = () => {
    if (!title || title.trim() === "") return;
    dispatch(createChatThunk(title));
    setIsModalOpen(false);
    setTitle(""); // reset input after creation
  };

  // Fetch chats on component mount
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  return (
    <>
      {/* Hamburger Button */}
      <button className="hamburger" onClick={() => dispatch(toggleSidebar())}>
        <FaBars className="fa-bars" />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        {/* Top Section */}
        <div className="sidebar-top">
          <div className="sidebar-option" onClick={handleNewChat}>
            <FaPlus /> <span>New chat</span>
          </div>
          <div className="sidebar-option">
            <FaSearch /> <span>Search chats</span>
          </div>
          <div className="sidebar-option">
            <FaBook /> <span>Library</span>
          </div>
        </div>

        <hr className="divider" />

        {/* Chats Section */}
        <div className="chats">
          <h4 className="chats-heading">Chats</h4>
          {loading ? (
            <p>Loading chats...</p>
          ) : error ? (
            <p>Error: {error}</p>
          ) : chatList.length === 0 ? (
            <p>No chats found.</p>
          ) : (
            <ul>
              {chatList.map((chat) => (
                <li key={chat._id} className="chat-item">
                  {chat.title}
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Bottom Profile Section */}
        <div className="sidebar-bottom">
          <div className="profile">
            <img src={user?.profilePic} alt="profile" className="profile-pic" />
            <span>{user?.name}</span>
          </div>
          <button className="upgrade-btn">
            {user?.plan === "Free" ? "Upgrade" : "Pro"}
          </button>
        </div>
      </div>

      {/* 🔹 Modal Component */}
      <NewChatModal
        isOpen={isModalOpen}
        title={title}
        setTitle={setTitle}
        onClose={() => setIsModalOpen(false)}
        onCreate={handleCreateChat}
      />
    </>
  );
};

export default Sidebar;
