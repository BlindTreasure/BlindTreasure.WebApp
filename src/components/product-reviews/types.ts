export interface Review {
  id: string;
  userId: string;
  userName: string;
  userAvatar?: string;
  rating: number;
  comment: string;
  createdAt: string;
  updatedAt?: string;
  category?: "BlindBox" | "Product" | string;
  itemName?: string;
  images?: string[];
  isApproved?: boolean;
  approvedAt?: string;
  orderDetailId?: string;
  blindBoxId?: string;
  productId?: string;
  sellerId?: string;
  sellerReply?: {
    content: string;
    createdAt: string;
    sellerName?: string;
  };
}

export interface ReviewStats {
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    5: number;
    4: number;
    3: number;
    2: number;
    1: number;
  };
}

export interface ProductReviewsProps {
  productId: string;
  productType?: "product" | "blindbox";
  newReview?: any; 
}
