import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";


export const fetchMessages = createAsyncThunk(
  "messages/fetchMessages",
  async (chatId, { rejectWithValue }) => {
    try {
      const res = await axios.get(`http://localhost:3000/api/message/${chatId}`, {
        withCredentials: true,
      });
      
      const formattedMessages = res.data.map(msg => ({...msg, isNew: false}))

      return { chatId, messages: formattedMessages };
    } catch (err) {
      return rejectWithValue(err.response?.data || "Failed to fetch messages");
    }
  }
);

const messagesSlice = createSlice({
  name: "messages",
  initialState: {
    items: {},
    loading: false,
    error: null,
  },
  reducers: {
    clearMessages: (state, action) => {
      const chatId = action.payload;
      state.items[chatId] = [];
    },
    addMessage: (state, action) => {
      const { chatId, ...msg } = action.payload;
      if (!state.items[chatId]) state.items[chatId] = [];
      state.items[chatId].push(msg);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMessages.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMessages.fulfilled, (state, action) => {
        state.loading = false;
        const { chatId, messages } = action.payload;
        state.items[chatId] = messages;
      })
      .addCase(fetchMessages.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMessages, addMessage } = messagesSlice.actions;
export default messagesSlice.reducer;
