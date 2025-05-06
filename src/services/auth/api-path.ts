const AUTH = "/v1/Authentication";
const LOGIN = AUTH + "/login";
const REGISTER = AUTH + "/register";
const VERIFY_EMAIL = AUTH + "/verify-email";
const FORGOT_PASSWORD_EMAIL = AUTH + "/forgot-password-email";
const FORGOT_PASSWORD_OTP = AUTH + "/forgot-password-otp";
const FORGOT_PASSWORD_CHANGE = AUTH + "/forgot-password-change";
const LOGOUT = AUTH + "/logout";
const REFRESH_TOKEN = AUTH + "/refresh-token";
const LOGIN_GOOGLE = AUTH + "/login-google";

export default {
  LOGIN,
  REGISTER,
  VERIFY_EMAIL,
  FORGOT_PASSWORD_EMAIL,
  FORGOT_PASSWORD_OTP,
  FORGOT_PASSWORD_CHANGE,
  LOGOUT,
  REFRESH_TOKEN,
  LOGIN_GOOGLE,
};
