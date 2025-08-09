"use client";

import { useState, useEffect } from "react";
import { getReview } from "@/services/review/api-services";
import { ReviewResponse } from "@/services/review/typings";
import { isTResponseData } from "@/utils/compare";

interface UseSellerReviewsProps {
  sellerId?: string;
  pageIndex?: number;
  pageSize?: number;
  search?: string;
  minRating?: number;
  maxRating?: number;
  hasComment?: boolean;
  hasSellerReply?: boolean;
  hasImages?: boolean;
}

export default function useSellerReviews({
  sellerId,
  pageIndex = 1,
  pageSize = 10,
  search,
  minRating,
  maxRating,
  hasComment,
  hasSellerReply,
  hasImages,
}: UseSellerReviewsProps) {
  const [reviews, setReviews] = useState<ReviewResponse[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);

  const fetchReviews = async () => {
    if (!sellerId) {
      setReviews([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const params = {
        ProductId: "",
        BlindBoxId: "",
        SellerId: sellerId,
        Search: search || "",
        MinRating: minRating,
        MaxRating: maxRating,
        HasComment: hasComment,
        HasImages: hasImages,
        HasSellerReply: hasSellerReply,
        PageIndex: pageIndex,
        PageSize: pageSize,
      };
      const response = await getReview(params);

      if (response && isTResponseData(response)) {
        const reviewData = response.value.data.result || [];
        setReviews(reviewData);
        setTotalPages(response.value.data.totalPages || 0);
        setTotalReviews(response.value.data.count || 0);
      } else {
        setReviews([]);
        setTotalPages(0);
        setTotalReviews(0);
      }
    } catch (err) {
      setError("Không thể tải đánh giá");
      setReviews([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [
    sellerId,
    pageIndex,
    pageSize,
    search,
    minRating,
    maxRating,
    hasComment,
    hasImages,
    hasSellerReply,
  ]);

  const refetch = () => {
    fetchReviews();
  };

  return {
    reviews,
    loading,
    error,
    totalPages,
    totalReviews,
    refetch,
  };
}
