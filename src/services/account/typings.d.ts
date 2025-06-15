declare namespace REQUEST {
  type TUpdateAvatar = {
    file: File;
  };

  type TUpdateInfoProfile = {
    fullName: string;
    email: string;
    phoneNumber: string;
    gender: boolean | null;
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

  type TCreateAddress = {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    province: string;
    postalCode?: string;
    isDefault?: boolean;
  };

  type TUpdateAddress = {
    fullName: string;
    phone: string;
    addressLine1: string;
    city: string;
    province: string;
    postalCode?: string;
  };
}

declare namespace API {
  type TProfileAccount = {
    userId: string;
    fullName: string;
    email: string;
    avatarUrl: string;
    dateOfBirth: string;
    gender: boolean | null;
    status: string;
    phoneNumber: string;
    roleName: string;
    createdAt: string;
  };

  type TUpdateAvatar = {
    avatarUrl: string;
  };

  type ResponseAddress = {
    id: string;
    userId: string;
    fullName: string;
    phone: string;
    addressLine1: string;
    addressLine2: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  };
}
