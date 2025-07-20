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
    addressLine: string;
    city: string;
    province: string;
    ward: string;
    district: string;
    postalCode?: string;
    isDefault?: boolean;
  };

  type TUpdateAddress = {
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    province: string;
    ward: string;
    district: string;
    postalCode?: string;
  };

  type UpdateSellerAvatar = {
    file: File;
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
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  };

  type TUpdateSellerProfile = {
    id: string;
    email: string;
    fullName: string;
    phone: string;
    dateOfBirth: string;
    companyName: string;
    taxId: string;
    companyAddress: string;
    coaDocumentUrl: string;
    status: string;
    isVerified: boolean;
  };

  type TResponeSeller = {
    sellerId: string;
    userId: string;
    fullName: string;
    email: string;
    phoneNumber?: string;
    dateOfBirth?: string;
    avatarUrl: string;
    status: SellerStatus;
    companyName: string;
    taxId?: string;
    companyAddress?: string;
    coaDocumentUrl: string;
    sellerStatus: string
    isVerified: boolean;
  };
}
