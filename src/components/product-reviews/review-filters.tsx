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
  sortBy: string;
  setSortBy: (value: string) => void;
  filterBy: string;
  setFilterBy: (value: string) => void;
}

const ReviewFilters: React.FC<ReviewFiltersProps> = ({
  sortBy,
  setSortBy,
  filterBy,
  setFilterBy
}) => {
  return (
    <motion.div
      variants={fadeIn("up", 0.2)}
      initial="hidden"
      animate="show"
      className="flex flex-wrap gap-4"
    >
      <Select value={sortBy} onValueChange={setSortBy}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Sắp xếp theo" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="newest">Mới nhất</SelectItem>
          <SelectItem value="oldest">Cũ nhất</SelectItem>
          <SelectItem value="highest">Đánh giá cao nhất</SelectItem>
          <SelectItem value="lowest">Đánh giá thấp nhất</SelectItem>
          <SelectItem value="most-helpful">Hữu ích nhất</SelectItem>
        </SelectContent>
      </Select>

      <Select value={filterBy} onValueChange={setFilterBy}>
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
          <SelectItem value="with-images">Có hình ảnh</SelectItem>
          <SelectItem value="with-reply">Có phản hồi</SelectItem>
        </SelectContent>
      </Select>
    </motion.div>
  );
};

export default ReviewFilters;
