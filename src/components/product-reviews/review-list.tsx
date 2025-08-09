'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/variants';
import { PaginationFooter } from '@/components/pagination-footer';
import ReviewItem from './review-item';
import { Review } from './types';

interface ReviewListProps {
  reviews: Review[];
  currentPage: number;
  totalPages: number;
  totalReviews: number;
  pageSize: number;
  isPending: boolean;
  onReviewDeleted: (reviewId: string) => void;
  onPageChange: (page: number) => void;
  onPageSizeChange: (newSize: number) => void;
}

const ReviewList: React.FC<ReviewListProps> = ({
  reviews,
  currentPage,
  totalPages,
  totalReviews,
  pageSize,
  isPending,
  onReviewDeleted,
  onPageChange,
  onPageSizeChange,
}) => {
  return (
    <div className="space-y-6">
      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        animate="show"
        className="space-y-6 border py-4"
      >
        {reviews.length === 0 ? (
          <div className="text-center py-8">
            <img
              src="/images/Empty-items.jpg"
              alt="Chưa có đánh giá"
              className="w-32 h-32 mx-auto mb-4 opacity-60"
            />
            <p className="text-gray-500">Chưa có đánh giá nào cho sản phẩm này</p>
          </div>
        ) : (
          <>
            {reviews.map((review) => (
              <ReviewItem
                key={review.id}
                review={review}
                onReviewDeleted={onReviewDeleted}
              />
            ))}

            {totalReviews > 0 && (
              <PaginationFooter
                currentPage={currentPage}
                totalPages={totalPages}
                totalItems={totalReviews}
                pageSize={pageSize}
                onPageSizeChange={(newSize) => {
                  onPageSizeChange(newSize);
                }}
                onPageChange={onPageChange}
                hideItemsInfo={true}
              />
            )}
          </>
        )}
      </motion.div>
    </div>
  );
};

export default ReviewList;
