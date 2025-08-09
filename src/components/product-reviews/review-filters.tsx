'use client';

import React from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { motion } from 'framer-motion';
import { fadeIn } from '@/utils/variants';

interface ReviewFiltersProps {
  minRating?: number;
  maxRating?: number;
  hasComment?: boolean;
  hasImages?: boolean;
  onFilterChange: (filters: {
    minRating?: number;
    maxRating?: number;
    hasComment?: boolean;
    hasImages?: boolean;
  }) => void;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  minRating,
  maxRating,
  hasComment,
  hasImages,
  onFilterChange
}) => {
  const handleRatingFilter = (value: string) => {
    if (value === "all") {
      onFilterChange({ minRating: undefined, maxRating: undefined, hasComment, hasImages });
    } else if (value === "5") {
      onFilterChange({ minRating: 5, maxRating: 5, hasComment, hasImages });
    } else if (value === "4") {
      onFilterChange({ minRating: 4, maxRating: 4, hasComment, hasImages });
    } else if (value === "3") {
      onFilterChange({ minRating: 3, maxRating: 3, hasComment, hasImages });
    } else if (value === "2") {
      onFilterChange({ minRating: 2, maxRating: 2, hasComment, hasImages });
    } else if (value === "1") {
      onFilterChange({ minRating: 1, maxRating: 1, hasComment, hasImages });
    } else if (value === "4-5") {
      onFilterChange({ minRating: 4, maxRating: 5, hasComment, hasImages });
    } else if (value === "3-5") {
      onFilterChange({ minRating: 3, maxRating: 5, hasComment, hasImages });
    }
  };

  const handleImageFilter = (value: string) => {
    const hasImageValue = value === "with-image" ? true : value === "without-image" ? false : undefined;
    onFilterChange({ minRating, maxRating, hasComment, hasImages: hasImageValue });
  };

  const handleCommentFilter = (value: string) => {
    const hasCommentValue = value === "with-comment" ? true : value === "without-comment" ? false : undefined;
    onFilterChange({ minRating, maxRating, hasComment: hasCommentValue, hasImages });
  };

  const getCurrentRatingFilter = () => {
    if (!minRating && !maxRating) return "all";
    if (minRating === 5 && maxRating === 5) return "5";
    if (minRating === 4 && maxRating === 4) return "4";
    if (minRating === 3 && maxRating === 3) return "3";
    if (minRating === 2 && maxRating === 2) return "2";
    if (minRating === 1 && maxRating === 1) return "1";
    if (minRating === 4 && maxRating === 5) return "4-5";
    if (minRating === 3 && maxRating === 5) return "3-5";
    return "all";
  };

  const getCurrentImageFilter = () => {
    if (hasImages === true) return "with-image";
    if (hasImages === false) return "without-image";
    return "all-image";
  };

  const getCurrentCommentFilter = () => {
    if (hasComment === true) return "with-comment";
    if (hasComment === false) return "without-comment";
    return "all-comment";
  };

  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-4"
    >
      <Select value={getCurrentRatingFilter()} onValueChange={handleRatingFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo rating" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả đánh giá</SelectItem>
          <SelectItem value="5">5 sao</SelectItem>
          <SelectItem value="4">4 sao</SelectItem>
          <SelectItem value="3">3 sao</SelectItem>
          <SelectItem value="2">2 sao</SelectItem>
          <SelectItem value="1">1 sao</SelectItem>
          <SelectItem value="4-5">4-5 sao</SelectItem>
          <SelectItem value="3-5">3-5 sao</SelectItem>
        </SelectContent>
      </Select>

      <Select value={getCurrentCommentFilter()} onValueChange={handleCommentFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo bình luận" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-comment">Tất cả</SelectItem>
          <SelectItem value="with-comment">Có bình luận</SelectItem>
          <SelectItem value="without-comment">Không có bình luận</SelectItem>
        </SelectContent>
      </Select>

      <Select value={getCurrentImageFilter()} onValueChange={handleImageFilter}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Lọc theo hình ảnh" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all-image">Tất cả</SelectItem>
          <SelectItem value="with-image">Có hình ảnh</SelectItem>
          <SelectItem value="without-image">Không có hình ảnh</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default ReviewFilters;
