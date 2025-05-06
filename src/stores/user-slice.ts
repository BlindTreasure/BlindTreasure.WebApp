import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Data {
  email: string;
  password: string;
}

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
    resetUser: (state) => {
      state.user = null;
    },
    updateImage: (state, action: PayloadAction<API.TUpdateAvatar>) => {
      if (state.user) {
        state.user.cropAvatarLink = action.payload.cropAvatarLink;
        state.user.fullAvatarLink = action.payload.fullAvatarLink;
      }
    },
    updateInformationProfile: (
      state,
      action: PayloadAction<API.TProfileAccount>
    ) => {
      if (state.user) {
        state.user.firstName = action.payload.firstName;
        state.user.lastName = action.payload.lastName;
      }
    },
  },
});

export const { loginUser, resetUser, updateImage, updateInformationProfile } =
  userSlice.actions;

export default userSlice.reducer;
