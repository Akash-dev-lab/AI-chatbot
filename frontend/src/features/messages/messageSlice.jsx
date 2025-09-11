import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk to fetch chat history
export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/api/message/${chatId}`,
        { withCredentials: true }
      );
      return { chatId, messages: res.data };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch messages");
    }
  }
);

// Async thunk to send new message
export const sendMessage = createAsyncThunk(
  "messages/sendMessage",
  async ({ chatId, content, role = "user" }, { rejectWithValue }) => {
    try {
      const res = await axios.post(
        "http://localhost:3000/api/message",
        { chatId, content, role },
        { withCredentials: true }
      );
      return { chatId, message: res.data }; // normalize payload
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to send message");
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    items: {}, // { chatId: [msg1, msg2, ...] }
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state, action) => {
      const chatId = action.payload;
      if (state.items[chatId]) {
        state.items[chatId] = [];
      }
    },
    addMessage: (state, action) => {
      const { chatId, message } = action.payload;
      if (!state.items[chatId]) state.items[chatId] = [];
      state.items[chatId].push(message);
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch messages
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, messages } = action.payload;
        state.items[chatId] = messages || [];
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Send message
      .addCase(sendMessage.fulfilled, (state, action) => {
        const { chatId, ...msg } = action.payload;
        if (!state.items[chatId]) state.items[chatId] = [];
        state.items[chatId].push(msg.message);
      });
  },
});

export const { clearMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
