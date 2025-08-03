declare namespace REQUEST {
  type TRegister = {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    dateOfBirth: string;
  };
  type TAuthResendOtp = {
    Email: string;
    Type: "Register" | "ForgotPassword";
  };
  type TAuthRegisterSeller = {
    email: string;
    password: string;
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
    companyName: string;
    taxId: string;
    companyAddress: string;
    coaDocumentUrl: string;
  };
}

declare namespace API {
  type TAuthResponse = {
    accessToken: string;
    refreshToken: string;
    user: TAuthProfile;
  };

  type TRefreshTokenResponse = {
    accessToken: string;
    refreshToken: string;
  };

  type TAuthRefreshToken = {
    refreshToken: string;
  };

  type TAuthForgotPasswordEmail = {
    email: string;
  };

  type TAuthForgotPasswordEmail = {
    email: string;
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

  // type TAuthToken = {
  //   accessToken: string;
  //   tokenType: string;
  // };

  type TAuthLoginGoogle = {
    accessTokenGoogle: string;
  };

  type TAuthProfile = {
    userId: string;
    sellerId?: string
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

  type TRegisterSellerResponse = {
    avatarUrl: string;
    createdAt: string;
    dateOfBirth: string;
    email: string;
    fullName: string;
    phoneNumber: string;
    roleName: string;
    userId: string;
    gender: string;
    status: string;
  };
}
