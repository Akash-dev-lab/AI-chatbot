import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import "../styles/Home.css";
import Aurora from '../ReactBit background/Aurora';;

const Home = () => {
  return (
    <div className="home-container">
      {/* Background Layer */}
      <div className="home-bg">
        <Aurora
          colorStops={["#3A29FF", "#FF94B4", "#FF3232"]}
          blend={0.0001}
          amplitude={1.0}
          speed={1}
        />
      </div>

      {/* Foreground (UI) */}
      <div className="home-content">
        <Sidebar />
        <ChatArea />
      </div>
    </div>
  );
};

export default Home;