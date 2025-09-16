import axios from "axios";

const API = axios.create({
  baseURL: "http://localhost:3000/api/chat",
  withCredentials: true,
});

export const createChat = async (title) => {
  const res = await API.post("/", {title});
  return res.data.chat;
};
