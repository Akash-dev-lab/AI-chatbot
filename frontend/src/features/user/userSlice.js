import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("https://ai-chatbot-1-qxr6.onrender.com/api/auth/profile", {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue("Not logged in");
    }
  }
);

export const logoutUser = createAsyncThunk(
  "user/logoutUser",

  async (_, { dispatch, rejectWithValue }) => {
    try {
      await axios.post(
        "https://ai-chatbot-1-qxr6.onrender.com/api/auth/logout",
        {},
        { withCredentials: true }
      );
      dispatch(clearUser());
      window.location.reload();
      return true;
    } catch (err) {
      return rejectWithValue(err.response?.data || "Logout failed");
    }
  }
);

export const uploadProfilePic = createAsyncThunk(
  "user/uploadProfilePic",
  async (file, { rejectWithValue, dispatch }) => {
    try {
      const formData = new FormData();
      formData.append("profilePic", file);

      const res = await axios.post(
        "https://ai-chatbot-1-qxr6.onrender.com/api/auth/upload-profile",
        formData,
        {
          withCredentials: true,
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      // Redux state update
      dispatch(updateUser({ profilePic: res.data.profilePic }));
      dispatch(setUser(res.data.user));

      return res.data.profilePic;
    } catch (err) {
      return rejectWithValue("Upload failed");
    }
  }
);

const initialState = {
  _id: null,
  name: "Guest",
  email: null,
  profilePic: "https://via.placeholder.com/40",
  plan: "Free",
  loading: false,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    // set / update full user details (login or fetch profile)
    setUser: (state, action) => {
      return { ...state, ...action.payload };
    },

    // clear user on logout
    clearUser: () => initialState,

    // update only selected fields
    updateUser: (state, action) => {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state.loading = false;
        state._id = action.payload._id;
        state.name = action.payload.fullName?.firstName || action.payload.name;
        state.email = action.payload.email;
        state.profilePic =
          action.payload.profilePic || "https://via.placeholder.com/40";
        state.plan = action.payload.plan || "Free";
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.loading = false;
      })
      // logoutUser
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(logoutUser.rejected, (state) => {
        state.loading = false;
      })
      .addCase(uploadProfilePic.fulfilled, (state, action) => {
        state.loading = false;
        state.profilePic = action.payload; // new imagekit URL
      });
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
