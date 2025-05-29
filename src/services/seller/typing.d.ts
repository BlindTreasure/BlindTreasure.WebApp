declare namespace REQUEST {
  type GetSellers = {
    status?: SellerStatus;
    pageIndex: number;
    pageSize: number;
  };

  type UpdateSellerInfo = {
    fullName: string;
    phoneNumber: string;
    dateOfBirth: string;
    companyName: string;
    taxId: string;
    companyAddress: string;
  };
}

declare namespace API {
  type Seller = {
    id: string;
    email: string;
    fullName: string;
    companyName: string;
    coaDocumentUrl: string;
    status: SellerStatus;
    isVerified: boolean;
    phoneNumber?: string;
    dateOfBirth?: string;
    taxId?: string;
    companyAddress?: string;
    sellerStatus: string
  };

  type ResponseDataSeller = {
    result: Seller[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}
