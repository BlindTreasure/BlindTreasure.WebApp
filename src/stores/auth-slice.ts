import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Data {}

export interface InitialState {
  forgotPassword: {
    email: string;
    otp: string;
  };
  signup: {
    email: string;
    otp: string;
  };
}

let initialState: InitialState = {
  forgotPassword: {
    email: "",
    otp: "",
  },
  signup: {
    email: "",
    otp: "",
  },
};

const authSlice = createSlice({
  name: "authSlice",
  initialState: initialState,
  reducers: {
    setForgotPasswordEmail: (
      state,
      action: PayloadAction<API.TAuthForgotPassword>
    ) => {
      state.forgotPassword.email = action.payload.email;
    },
    setForgotPasswordOtp: (
      state,
      action: PayloadAction<API.TAuthForgotPassword>
    ) => {
      state.forgotPassword.otp = action.payload.otp;
    },
    setSignupEmail: (state, action: PayloadAction<API.TAuthVerifyOtp>) => {
      state.signup.email = action.payload.email;
    },
    setSignupOtp: (state, action: PayloadAction<API.TAuthVerifyOtp>) => {
      state.signup.otp = action.payload.otp;
    },
    resetForgotPasswordOtp: (state) => {
      state.forgotPassword.otp = "";
    },
    resetForgotPasswordEmail: (state) => {
      state.forgotPassword.email = "";
    },
    resetForgotPassword: (state) => {
      state.forgotPassword.email = "";
      state.forgotPassword.otp = "";
    },
    resetSignupEmail: (state) => {
      state.signup.email = "";
    },
    resetSignupOtp: (state) => {
      state.signup.otp = "";
    },
    resetSignup: (state) => {
      state.signup.email = "";
      state.signup.otp = "";
    },
  },
});

export const {
  setForgotPasswordEmail,
  setForgotPasswordOtp,
  resetForgotPasswordOtp,
  resetForgotPasswordEmail,
  resetForgotPassword,

  setSignupEmail,
  setSignupOtp,
  resetSignupEmail,
  resetSignupOtp,
  resetSignup,
} = authSlice.actions;

export default authSlice.reducer;
