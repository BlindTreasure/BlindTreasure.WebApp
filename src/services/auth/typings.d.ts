declare namespace REQUEST {
  type TRegister = {
    fullName: string;
    email: string;
    phoneNumber: string;
    password: string;
    confirmPassword: string; 
    dateOfBirth: string;
  };
  type TAuthVerifyEmail = {
    email: string;
  };
}

declare namespace API {
  type TAuthResponse = {
    token: TAuthToken;
    authProfile: TAuthProfile;
  };

  type TAuthForgotPasswordEmail = {
    email: string;
  };

  type TAuthForgotPasswordOtp = {
    email: string;
    otp: string;
  };

  type TAuthForgotPasswordChange = {
    email: string;
    otp: string;
    password: string;
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
    firstName: string;
    lastName: string;
    cropAvatarLink: string;
    fullAvatarLink: string;
    roleId: AuthRole;
  };

  type TAuthForgotPassword = {
    email: string;
    otp: string;
  };
}
