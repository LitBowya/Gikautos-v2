import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import channelReducer from "./slices/channelSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";

const store = configureStore({
  reducer: {
    [apiSlice.reducerPath]: apiSlice.reducer,
    cart: cartSliceReducer,
    auth: authSliceReducer,
    channel: channelReducer,
  },
  middleware: (getDefaultMiddleware) => [
    ...getDefaultMiddleware(),
    apiSlice.middleware,
  ],
  devtools: true,
});

export default store;
