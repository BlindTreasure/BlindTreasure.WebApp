import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
    profile?: API.TProfileAccount | null;
}

let initialState: InitialState = { profile: null };

const userSlice = createSlice({
    name: "userSlice",
    initialState: initialState,
    reducers: {
        updateProfile: (state, action: PayloadAction<API.TProfileAccount>) => {
            state.profile = action.payload;
        },
        resetProfile: (state) => {
            state.profile = null;
        },
    },
});

export const { updateProfile, resetProfile } = userSlice.actions;

export default userSlice.reducer;
