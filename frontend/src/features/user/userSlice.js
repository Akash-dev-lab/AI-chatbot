import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

export const fetchCurrentUser = createAsyncThunk(
  "user/fetchCurrentUser",
  async (_, { rejectWithValue }) => {
    try {
      const res = await axios.get("http://localhost:3000/api/auth/profile", {
        withCredentials: true,
      });
      return res.data;
    } catch (err) {
      return rejectWithValue("Not logged in");
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
      });
  },
});

export const { setUser, clearUser, updateUser } = userSlice.actions;
export default userSlice.reducer;
