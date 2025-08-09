'use client';

import React, { useState, useEffect } from 'react';
import RatingOverview from './rating-overview';
import ReviewFilters from './review-filters';
import ReviewList from './review-list';
import { Review, ReviewStats, ProductReviewsProps } from './types';
import { getReview } from '@/services/review/api-services';
import { isTResponseData } from '@/utils/compare';

const ProductReviews: React.FC<ProductReviewsProps> = ({
  productId,
  productType = 'product',
  newReview
}) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [stats, setStats] = useState<ReviewStats>({
    averageRating: 0,
    totalReviews: 0,
    ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
  });
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<{
    minRating?: number;
    maxRating?: number;
    hasComment?: boolean;
    hasImage?: boolean;
  }>({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalReviews, setTotalReviews] = useState(0);
  const [pageSize, setPageSize] = useState(5);

  const calculateStats = (reviewList: Review[]): ReviewStats => {
    if (reviewList.length === 0) {
      return {
        averageRating: 0,
        totalReviews: 0,
        ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
      };
    }

    const totalReviews = reviewList.length;
    const ratingSum = reviewList.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = ratingSum / totalReviews;

    const ratingDistribution = reviewList.reduce(
      (dist, review) => {
        dist[review.rating as keyof typeof dist]++;
        return dist;
      },
      { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    );

    return {
      averageRating: Math.round(averageRating * 100) / 100,
      totalReviews,
      ratingDistribution
    };
  };

  const fetchReviews = async () => {
    if (!productId) return;

    setIsPending(true);
    setError(null);

    try {
      const params = {
        ProductId: productType === 'product' ? productId : '',
        BlindBoxId: productType === 'blindbox' ? productId : '',
        SellerId: '',
        MinRating: filters.minRating,
        MaxRating: filters.maxRating,
        HasComment: filters.hasComment,
        HasImage: filters.hasImage,
        PageIndex: currentPage,
        PageSize: pageSize
      };
      const response = await getReview(params);

      if (response && isTResponseData(response)) {
        const reviewData = response.value.data.result || [];
        const paginationData = response.value.data;
        const convertedReviews: Review[] = reviewData.map((review: any) => ({
          id: review.id,
          userId: review.userId,
          userName: review.userName,
          userAvatar: review.userAvatar,
          rating: review.rating,
          comment: review.comment,
          createdAt: review.createdAt,
          updatedAt: review.updatedAt,
          category: review.category,
          itemName: review.itemName,
          images: review.images || [],
          isApproved: review.isApproved,
          approvedAt: review.approvedAt,
          orderDetailId: review.orderDetailId,
          blindBoxId: review.blindBoxId,
          productId: review.productId,
          sellerId: review.sellerId,
          sellerName: review.sellerName,
          sellerReply: review.sellerReply ? {
            content: review.sellerReply.content,
            createdAt: review.sellerReply.createdAt,
            sellerName: review.sellerReply.sellerName
          } : undefined,
        }));

        setReviews(convertedReviews);
        setStats(calculateStats(convertedReviews));
        setTotalPages(paginationData.totalPages || 0);
        setTotalReviews(paginationData.count || 0);
      } else {
        setReviews([]);
        setStats({
          averageRating: 0,
          totalReviews: 0,
          ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
        });
        setTotalPages(0);
        setTotalReviews(0);
      }
    } catch (err) {
      setError('Không thể tải đánh giá');
      setReviews([]);
    } finally {
      setIsPending(false);
    }
  };

  useEffect(() => {
    fetchReviews();
  }, [productId, productType, filters, currentPage, pageSize]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filters, pageSize]);

  useEffect(() => {
    if (newReview) {
      const review: Review = {
        id: newReview.id,
        userId: newReview.userId,
        userName: newReview.userName,
        userAvatar: newReview.userAvatar,
        rating: newReview.rating,
        comment: newReview.comment,
        createdAt: newReview.createdAt,
        updatedAt: newReview.updatedAt,
        category: newReview.category,
        itemName: newReview.itemName,
        images: newReview.images || [],
        isApproved: newReview.isApproved,
        approvedAt: newReview.approvedAt,
        orderDetailId: newReview.orderDetailId,
        blindBoxId: newReview.blindBoxId,
        productId: newReview.productId,
        sellerId: newReview.sellerId,
        sellerReply: newReview.sellerReply ? {
          content: newReview.sellerReply.content,
          createdAt: newReview.sellerReply.createdAt,
          sellerName: newReview.sellerReply.sellerName
        } : undefined,
      };

      setReviews(prev => [review, ...prev]);
      setStats(prev => {
        const newTotal = prev.totalReviews + 1;
        const newSum = (prev.averageRating * prev.totalReviews) + newReview.rating;
        const newAverage = newSum / newTotal;

        const newDistribution = { ...prev.ratingDistribution };
        newDistribution[newReview.rating as keyof typeof newDistribution]++;

        return {
          averageRating: Math.round(newAverage * 100) / 100,
          totalReviews: newTotal,
          ratingDistribution: newDistribution
        };
      });
    }
  }, [newReview]);

  if (isPending) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
          <p className="mt-2 text-gray-600">Đang tải đánh giá...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchReviews}
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>

      <RatingOverview stats={stats} />

      <ReviewFilters
        minRating={filters.minRating}
        maxRating={filters.maxRating}
        hasComment={filters.hasComment}
        hasImage={filters.hasImage}
        onFilterChange={(newFilters) => {
          setFilters(newFilters);
        }}
      />

      <ReviewList
        reviews={reviews}
        currentPage={currentPage}
        totalPages={totalPages}
        totalReviews={totalReviews}
        pageSize={pageSize}
        isPending={isPending}
        onReviewDeleted={(reviewId) => {
          setReviews(prev => prev.filter(r => r.id !== reviewId));
          setStats(prev => {
            const newTotal = prev.totalReviews - 1;
            if (newTotal === 0) {
              return {
                averageRating: 0,
                totalReviews: 0,
                ratingDistribution: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
              };
            }

            const deletedReview = reviews.find(r => r.id === reviewId);
            if (deletedReview) {
              const newSum = (prev.averageRating * prev.totalReviews) - deletedReview.rating;
              const newAverage = newSum / newTotal;

              const newDistribution = { ...prev.ratingDistribution };
              newDistribution[deletedReview.rating as keyof typeof newDistribution]--;

              return {
                averageRating: Math.round(newAverage * 100) / 100,
                totalReviews: newTotal,
                ratingDistribution: newDistribution
              };
            }
            return prev;
          });
        }}
        onPageChange={setCurrentPage}
        onPageSizeChange={(newSize) => {
          setPageSize(newSize);
          setCurrentPage(1);
        }}
      />
    </div>
  );
};

export default ProductReviews;
