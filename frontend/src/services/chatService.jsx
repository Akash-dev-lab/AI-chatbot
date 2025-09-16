import axios from "axios";

const API = axios.create({
  baseURL: "https://ai-chatbot-1-qxr6.onrender.com/api/chat",
  withCredentials: true,
});

export const createChat = async (title) => {
  const res = await API.post("/", {title});
  return res.data.chat;
};
