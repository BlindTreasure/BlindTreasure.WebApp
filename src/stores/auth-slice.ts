import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface Data {}

export interface InitialState {
  forgotPassword: {
    email: string;
   
  };
  signup: {
    email: string;
    otp: string;
  };
}

let initialState: InitialState = {
  forgotPassword: {
    email: "",
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
    
    setSignupEmail: (state, action: PayloadAction<API.TAuthVerifyOtp>) => {
      state.signup.email = action.payload.email;
    },
    setSignupOtp: (state, action: PayloadAction<API.TAuthVerifyOtp>) => {
      state.signup.otp = action.payload.otp;
    },
    
    resetForgotPasswordEmail: (state) => {
      state.forgotPassword.email = "";
    },
    resetForgotPassword: (state) => {
      state.forgotPassword.email = "";
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
  resetForgotPasswordEmail,
  resetForgotPassword,

  setSignupEmail,
  setSignupOtp,
  resetSignupEmail,
  resetSignupOtp,
  resetSignup,
} = authSlice.actions;

export default authSlice.reducer;
