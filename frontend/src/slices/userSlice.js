// userSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  userId: localStorage.getItem("userId") || null,
  userName: localStorage.getItem("userName") || null,
  isPrivateChat: localStorage.getItem("isPrivateChat") === "true" || false,
  selectedUser: JSON.parse(localStorage.getItem("selectedUser")) || null,
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
      state.isPrivateChat = false;
      state.selectedUser = null;
      localStorage.removeItem("userId");
      localStorage.removeItem("userName");
      localStorage.removeItem("isPrivateChat");
      localStorage.removeItem("selectedUser");
    },
    setSelectedUser: (state, action) => {
      state.selectedUser = action.payload;
      localStorage.setItem("selectedUser", JSON.stringify(action.payload));
      state.isPrivateChat = true;
      localStorage.setItem("isPrivateChat", "true");
    },
    clearSelectedUser: (state) => {
      state.selectedUser = null;
      localStorage.removeItem("selectedUser");
      state.isPrivateChat = false;
      localStorage.setItem("isPrivateChat", "false");
    },
  },
});

export const {
  setUserInfo,
  clearUserInfo,
  setSelectedUser,
  clearSelectedUser,
} = userSlice.actions;

export default userSlice.reducer;
