import { io } from "socket.io-client";

const socket = io("https://ai-chatbot-qe6a.onrender.com/");

export default socket;
