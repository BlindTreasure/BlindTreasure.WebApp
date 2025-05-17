declare namespace REQUEST {
  type TRegister = {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    dateOfBirth: string;
  };
  type TAuthVerifyEmail = {
    email: string;
  };
}

declare namespace API {
  type TAuthResponse = {
    accessToken: string;
    refreshToken: string;
    user: TAuthProfile
  };

  type TAuthRefreshToken = {
    refreshToken: string;
  };

  type TAuthForgotPasswordEmail = {
    email: string;
  };

  type TAuthForgotPasswordOtp = {
    email: string;
    otp: string;
  };

  type TAuthVerifyOtp = {
    email: string;
    otp: string;
  };

  type TAuthForgotPasswordChange = {
    email: string;
    otp: string;
    newPassword: string;
  };

  type TAuthToken = {
    accessToken: string;
    tokenType: string;
  };

  type TAuthLoginGoogle = {
    accessTokenGoogle: string;
  };

  type TAuthProfile = {
    userId: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    dateOfBirth: string;
    phoneNumber: string;
    roleName: string;
    createdAt: string;
  };

  type TAuthForgotPassword = {
    email: string;
  };
  type TRegisterResponse = {
    avatarUrl: string;
    createdAt: string;
    dateOfBirth: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    roleName: string;
    userId: string;
  };
}
