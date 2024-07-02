import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";
import { channelsApiSlice } from './slices/channelSlice';
import { messagesApiSlice } from './slices/messageSlice';
import { repliesApiSlice } from './slices/replySlice';

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
    [channelsApiSlice.reducerPath]: channelsApiSlice.reducer,
    [messagesApiSlice.reducerPath]: messagesApiSlice.reducer,
    [repliesApiSlice.reducerPath]: repliesApiSlice.reducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    apiSlice.middleware,
    channelsApiSlice.middleware,
    messagesApiSlice.middleware,
    repliesApiSlice.middleware,
  ],
  devtools: true,
});

export default store;
