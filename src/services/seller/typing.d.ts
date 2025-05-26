declare namespace REQUEST {
  type GetSellers = {
    status?: SellerStatus;
    pageIndex: number;
    pageSize: number;
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
  };

  type ResponseDataSeller = {
    result: Seller[];
    count: number;
    pageSize: number;
    currentPage: number;
    totalPages: number;
  };
}
