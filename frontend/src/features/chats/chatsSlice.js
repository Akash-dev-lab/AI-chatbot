// src/features/chats/chatsSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  chatList: [
    "Frontend setup guide",
    "Lung cough suggestions",
    "Sperm consistency issues",
    "Navgrah effects on life",
    "How to take pills",
    "Sardi ke lakshan aur upay",
    "Bukhar ka solution",
    "MCP servers explained",
    "Mongoose validation error fix",
    "Embeddings visualization explan...",
    "3D vector plotting demo",
    "Vector database explanation",
    "Generate doodle image",
  ],
};

const chatsSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addChat: (state, action) => {
      state.chatList.unshift(action.payload); // new chat at top
    },
  },
});

export const { addChat } = chatsSlice.actions;
export default chatsSlice.reducer;
