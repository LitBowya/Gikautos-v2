// channelSlice.js

import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  channelId: localStorage.getItem("channelId") || null,
  channelName: localStorage.getItem("channelName") || null,
};

const channelSlice = createSlice({
  name: "channel",
  initialState,
  reducers: {
    setChannelInfo: (state, action) => {
      state.channelId = action.payload.channelId;
      state.channelName = action.payload.channelName;
      localStorage.setItem("channelId", action.payload.channelId);
      localStorage.setItem("channelName", action.payload.channelName);
    },
    clearChannelInfo: (state) => {
      state.channelId = null;
      state.channelName = null;
      localStorage.removeItem("channelId");
      localStorage.removeItem("channelName");
    },
  },
});

export const { setChannelInfo, clearChannelInfo } = channelSlice.actions;

export default channelSlice.reducer;
