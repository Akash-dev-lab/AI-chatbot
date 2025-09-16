import "../styles/Home.css";
import { Suspense, lazy } from "react";
import Aurora from '../ReactBit background/Aurora';;
import Loader from "../components/Loader";

const Sidebar = lazy(() => import("../components/Sidebar"));
const ChatArea = lazy(() => import("../components/ChatArea"));

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
        <Suspense fallback={<Loader text="Loading Sidebar..." />}>
          <Sidebar />
        </Suspense>

        <Suspense fallback={<Loader text="Loading Chats..." />}>
          <ChatArea />
        </Suspense>
      </div>
    </div>
  );
};

export default Home;