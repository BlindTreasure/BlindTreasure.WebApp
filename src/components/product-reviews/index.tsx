'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/variants';
import RatingOverview from './rating-overview';
import ReviewFilters from './review-filters';
import ReviewItem from './review-item';

import { Review, ReviewStats, ProductReviewsProps } from './types';

// Mock data
const mockReviews: Review[] = [
  {
    id: '1',
    userId: 'user1',
    userName: 'h****3',
    userAvatar: '',
    rating: 5,
    comment: 'Giao hàng nhanh, sp y hình, sp chỉ làm đây ko làm đâi nha, mì mình đã uốn nên khi chuột sẽ đây hơn thui, mau khô, chuột xong nhớ lấy đầu con lại chải ra mới tới nha',
    createdAt: '2025-06-10T13:08:00Z',
    category: 'Phân loại hàng: LE01',
    experience: 'chuột mì làm đây mì',
    appearance: 'chuột mì',
    images: ['/images/review1.jpg', '/images/review2.jpg', '/images/review3.jpg'],
    likes: 4,
    sellerReply: {
      content: 'Xin chào! Rất cảm ơn tình cảm và sự đánh giá cao của bạn. Sự hài lòng của bạn là phần thưởng lớn nhất của chúng tôi, cửa hàng sẽ làm việc chăm chỉ hơn và rất mong được bạn ghé thăm lần sau.',
      createdAt: '2025-06-11T09:30:00Z'
    }
  },
  {
    id: '2',
    userId: 'user2',
    userName: 'a****5',
    userAvatar: '',
    rating: 4,
    comment: 'Sản phẩm tốt, đóng gói cẩn thận. Giao hàng nhanh chóng.',
    createdAt: '2025-06-08T15:20:00Z',
    category: 'Phân loại hàng: LE02',
    experience: 'tốt',
    appearance: 'đẹp',
    likes: 2
  }
];

const mockStats: ReviewStats = {
  averageRating: 4.95,
  totalReviews: 1745,
  ratingDistribution: {
    5: 70,
    4: 17,
    3: 8,
    2: 4,
    1: 1
  }
};

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId, productType = 'product' }) => {
  const [reviews, setReviews] = useState<Review[]>(mockReviews);
  const [stats, setStats] = useState<ReviewStats>(mockStats);
  const [sortBy, setSortBy] = useState<string>('newest');
  const [filterBy, setFilterBy] = useState<string>('all');

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Đánh giá sản phẩm</h2>

      <RatingOverview stats={stats} />

      <ReviewFilters
        sortBy={sortBy}
        setSortBy={setSortBy}
        filterBy={filterBy}
        setFilterBy={setFilterBy}
      />

      <motion.div
        variants={fadeIn("up", 0.3)}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        {reviews.map((review) => (
          <ReviewItem key={review.id} review={review} />
        ))}
      </motion.div>
    </div>
  );
};

export default ProductReviews;
