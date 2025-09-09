import "../styles/Sidebar.css";
import { FaPlus, FaSearch, FaBook, FaBars } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleSidebar } from "../features/sidebar/sidebarSlice";

const Sidebar = () => {
  const dispatch = useDispatch();
  const { isOpen } = useSelector((state) => state.sidebar);
  const chats = useSelector((state) => state.chats.chatList);
  const user = useSelector((state) => state.user);

  return (
    <>
      <button
        className="hamburger"
        onClick={() => dispatch(toggleSidebar())}
      >
        <FaBars className="fa-bars" />
      </button>

      {/* Sidebar */}
      <div className={`sidebar ${isOpen ? "active" : ""}`}>
        {/* Top Section */}
        <div className="sidebar-top">
          <div className="sidebar-option">
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
            {chats.map((chat, index) => (
              <li key={index} className="chat-item">
                {chat}
              </li>
            ))}
        </div>

        {/* Bottom Profile Section */}
        <div className="sidebar-bottom">
          <div className="profile">
            <img
              src={user.profilePic}
              alt="profile"
              className="profile-pic"
            />
            <span>{user.name}</span>
          </div>
          <button className="upgrade-btn">
            {user.plan === "Free" ? "Upgrade" : "Pro"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
