import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Fetch all chats
export const fetchChats = createAsyncThunk(
  "chats/fetchChats",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("https://ai-chatbot-1-qxr6.onrender.com/api/chat", { withCredentials: true });
      return res.data.chats;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

// Create a new chat
export const createChat = createAsyncThunk(
  "chats/createChat",
  async (title, { rejectWithValue }) => {
    try {
      const res = await axios.post("https://ai-chatbot-1-qxr6.onrender.com/api/chat", { title }, { withCredentials: true });
      return res.data.chat;
    } catch (err) {
      return rejectWithValue(err.response?.data || err.message);
    }
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState: {
    chatList: [],
    loading: false,
    error: null,
  },
  reducers: {
     setChats: (state, action) => {
      state.list = action.payload;
    },
    setActiveChat: (state, action) => {
      state.activeChatId = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch chats
      .addCase(fetchChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchChats.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Create new chat
      .addCase(createChat.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createChat.fulfilled, (state, action) => {
        state.loading = false;
        if (!state.list) state.list = []; 
        state.list.push(action.payload);
        state.activeChatId = action.payload._id;
      })
      .addCase(createChat.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { setChats, setActiveChat } = chatSlice.actions;

export default chatSlice.reducer;
