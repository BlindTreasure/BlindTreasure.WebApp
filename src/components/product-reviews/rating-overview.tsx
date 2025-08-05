'use client';

import React from 'react';
import { Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/variants';
import { ReviewStats } from './types';

interface RatingOverviewProps {
  stats: ReviewStats;
}

const StarRating: React.FC<{ rating: number; size?: 'sm' | 'md' }> = ({ rating, size = 'sm' }) => {
  const sizeClass = size === 'sm' ? 'w-4 h-4' : 'w-5 h-5';

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'
            }`}
        />
      ))}
    </div>
  );
};

const RatingOverview: React.FC<RatingOverviewProps> = ({ stats }) => {
  return (
    <motion.div
      variants={fadeIn("up", 0.1)}
      initial="hidden"
      animate="show"
      className="bg-gradient-to-r p-6 rounded-xl border"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="flex items-center gap-1">
          <StarRating rating={Math.round(stats.averageRating)} size="md" />
          <span className="text-2xl font-bold text-gray-800 ml-2">
            {stats.averageRating} out of 5
          </span>
        </div>
      </div>

      <p className="text-gray-600 mb-4">{stats.totalReviews.toLocaleString()} global ratings</p>

      <div className="space-y-2">
        {[5, 4, 3, 2, 1].map((rating) => (
          <div key={rating} className="flex items-center gap-3">
            <span className="text-yellow-600 font-medium w-12">{rating} sao</span>
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}%` }}
              />
            </div>
            <span className="text-gray-600 w-8 text-right">
              {stats.ratingDistribution[rating as keyof typeof stats.ratingDistribution]}%
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
};

export default RatingOverview;
