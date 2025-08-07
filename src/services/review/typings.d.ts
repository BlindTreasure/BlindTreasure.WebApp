export type ReviewCreateRequest = {
  orderDetailId: string;
  rating: number;
  comment: string;
  images: File[]; 
};

export type ReviewGetRequest = {
  ProductId: string;
  BlindBoxId: string;
  SellerId: string;
  MinRating?: number;
  MaxRating?: number;
  HasComment?: boolean;
  HasImage?: boolean;
  PageIndex?: number;
  PageSize?: number;
};

export type ReviewResponse = {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt: string;
  category: "BlindBox" | "Product";
  itemName: string;
  images: string[];
  isApproved: boolean;
  approvedAt: string;
  orderDetailId: string;
  blindBoxId?: string;
  productId?: string;
  sellerId: string;
};

export type ReviewListResponse = {
  result: ReviewResponse[];
  count: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
};

export type ReviewStats = {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
};
