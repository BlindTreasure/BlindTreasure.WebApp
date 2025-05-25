const AUTH = "/auth";
const LOGIN = AUTH + "/login";
const REGISTER = AUTH + "/register";
const VERIFY_OTP = AUTH + "/verify-otp";
const LOGOUT = AUTH + "/logout";
const REFRESH_TOKEN = AUTH + "/refresh-token";
const FORGOT_PASSWORD_EMAIL = AUTH + "/forgot-password";
const FORGOT_PASSWORD_CHANGE = AUTH + "/reset-password";
const RESEND_OTP = AUTH + "/resend-otp";
const REGISTER_SELLER = AUTH + "/register-seller";

const LOGIN_GOOGLE = AUTH + "/login-google";

export default {
  LOGIN,
  REGISTER,
  VERIFY_OTP,
  FORGOT_PASSWORD_EMAIL,
  FORGOT_PASSWORD_CHANGE,
  LOGOUT,
  REFRESH_TOKEN,
  RESEND_OTP,
  REGISTER_SELLER,
  LOGIN_GOOGLE,
};
