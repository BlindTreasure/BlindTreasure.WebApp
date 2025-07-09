import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface InitialState {
  user?: API.TAuthProfile | null;
  status: string;
}

let initialState: InitialState = { status: "idle", user: null };

const userSlice = createSlice({
  name: "userSlice",
  initialState: initialState,
  reducers: {
    loginUser: (state, action: PayloadAction<API.TAuthProfile>) => {
      state.user = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
    clearUser(state) {
      state.user = null;
    },
    updateImage: (state, action: PayloadAction<API.TUpdateAvatar>) => {
      if (state.user) {
        state.user.avatarUrl = action.payload.avatarUrl;
      }
    },
    updateInformationProfile: (
      state,
      action: PayloadAction<API.TProfileAccount>
    ) => {
      if (state.user) {
        state.user.fullName = action.payload.fullName;
      }
    },
  },
});

export const {
  loginUser,
  setUser,
  clearUser,
  updateImage,
  updateInformationProfile,
} = userSlice.actions;
export default userSlice.reducer;
