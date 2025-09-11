import "../styles/Sidebar.css";
import { FaPlus, FaSearch, FaBook, FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/sidebar/sidebarSlice";
import { fetchChats, createChat, setActiveChat } from "../features/chats/chatsSlice";
import { useState, useEffect } from "react";
import NewChatModal from "./NewChatModal";
import ThemeToggle from "./ThemeToggle";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.sidebar);
  const user = useSelector((state) => state.user);
  const { list = [], activeChatId } = useSelector((state) => state.chats);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [title, setTitle] = useState("");

  // ✅ Fetch chats on mount
  useEffect(() => {
    dispatch(fetchChats());
  }, [dispatch]);

  // ✅ Create new chat
  const handleCreateChat = () => {
    if (!title.trim()) return;
    dispatch(createChat(title));
    setIsModalOpen(false);
    setTitle("");
  };

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
          <div className="sidebar-option" onClick={() => setIsModalOpen(true)}>
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

        {/* Chats List */}
        <div className="chats">
          <h4 className="chats-heading">Chats</h4>
          {list.length > 0 ? (
            list.map((chat) => (
              <div
                key={chat._id}
                className={`chat-item ${activeChatId === chat._id ? "active" : ""}`}
                onClick={() => dispatch(setActiveChat(chat._id))}
              >
                {chat.title}
              </div>
            ))
          ) : (
            <p className="no-chats">No chats yet</p>
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
           <ThemeToggle />
        </div>
      </div>

      {/* Modal */}
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
