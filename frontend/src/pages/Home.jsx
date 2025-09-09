import Sidebar from "../components/Sidebar";
import ChatArea from "../components/ChatArea";
import "../styles/Home.css";

const Home = () => {

  return (
    <div className="home-container">
      <Sidebar />
      <ChatArea /> 
    </div>
  );
};

export default Home;
