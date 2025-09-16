import { configureStore } from "@reduxjs/toolkit";
import sidebarReducer from "../src/features/sidebar/sidebarSlice";
import chatsReducer from "../src/features/chats/chatsSlice";
import userReducer from "../src/features/user/userSlice";
import messagesReducer from "../src/features/messages/messageSlice";
import themeReducer from "../src/features/theme/themeSlice";

export const store = configureStore({
  reducer: {
    sidebar: sidebarReducer,
    chats: chatsReducer,
    user: userReducer,
    messages: messagesReducer,
    theme: themeReducer,
  },
});
