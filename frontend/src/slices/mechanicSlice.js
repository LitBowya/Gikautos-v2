import { createSlice } from "@reduxjs/toolkit";

const mechanicsSlice = createSlice({
    name: "mechanics",
    initialState: {
        data: null,
    },
    reducers: {
        setMechanicsData(state, action) {
            state.data = action.payload;
        },
        clearMechanicsData(state) {
            state.data = null;
        },
    },
});

export const { setMechanicsData, clearMechanicsData } = mechanicsSlice.actions;
export default mechanicsSlice.reducer;
