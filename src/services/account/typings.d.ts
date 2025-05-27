declare namespace REQUEST {
  type TUpdateAvatar = {
    cropAvatar: File;
    fullAvatar: File;
  };

  type TUpdateInfoProfile = {
    firstName: string;
    lastName: string;
    phoneNumber: string;
    gender: number;
  };

  type TUpdateEmail = {
    email: string;
  };

  type TVerifyChangeEmail = {
    userId: string;
  };

  type TChangePassword = {
    password: string;
  };

  type TVerifyChangePassword = {
    userId: string;
  };
}

declare namespace API {
  type TProfileAccount = {
    userId: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    dateOfBirth: string;
    gender: number | null;
    status: string;
    phoneNumber: string;
    roleName: string;
    createdAt: string;
  };

  type TUpdateAvatar = {
    cropAvatarLink: string;
    fullAvatarLink: string;
  };
}
