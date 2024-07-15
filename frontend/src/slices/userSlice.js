// channelSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId") || null,
  userName: localStorage.getItem("userName") || null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    setUserInfo: (state, action) => {
      state.userId = action.payload.userId;
      state.userName = action.payload.userName;
      localStorage.setItem("userId", action.payload.userId);
      localStorage.setItem("userName", action.payload.userName);
    },
    clearUserInfo: (state) => {
      state.userId = null;
      state.userName = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
