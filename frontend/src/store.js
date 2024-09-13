import { configureStore } from "@reduxjs/toolkit";
import { apiSlice } from "./slices/apiSlice";
import channelReducer from "./slices/channelSlice";
import cartSliceReducer from "./slices/cartSlice";
import authSliceReducer from "./slices/authSlice";
import userReducer from "./slices/userSlice";
import mechanicsReducer from "./slices/mechanicSlice"; // Import the new slice

const store = configureStore({
    reducer: {
        [apiSlice.reducerPath]: apiSlice.reducer,
        cart: cartSliceReducer,
        auth: authSliceReducer,
        channel: channelReducer,
        user: userReducer,
        mechanics: mechanicsReducer, // Add it to the store
    },
    middleware: (getDefaultMiddleware) => [
        ...getDefaultMiddleware(),
        apiSlice.middleware,
    ],
    devtools: true,
});

export default store;
