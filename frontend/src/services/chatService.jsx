import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-chatbot-qe6a.onrender.com/api/chat",
  withCredentials: true,
});

export const createChat = async (title) => {
  const res = await API.post("/", {title});
  return res.data.chat;
};
