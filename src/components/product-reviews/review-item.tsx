'use client';

import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, ThumbsUp, MoreHorizontal, Play } from 'lucide-react';
import { Review } from './types';

interface ReviewItemProps {
  review: Review;
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

const ReviewItem: React.FC<ReviewItemProps> = ({ review }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start gap-4 mb-4">
          <Avatar className="w-12 h-12">
            <AvatarImage src={review.userAvatar} />
            <AvatarFallback className="bg-gray-200">
              {review.userName.charAt(0)}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-medium text-gray-800">{review.userName}</span>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)} | {review.category}
            </p>
          </div>

          <Button variant="ghost" size="sm">
            <MoreHorizontal className="w-4 h-4" />
          </Button>
        </div>

        {(review.experience || review.appearance) && (
          <div className="mb-4 space-y-1">
            {review.experience && (
              <p className="text-sm">
                <span className="text-gray-600">Kinh nghiệm sử dụng:</span>{' '}
                <span className="text-gray-800">{review.experience}</span>
              </p>
            )}
            {review.appearance && (
              <p className="text-sm">
                <span className="text-gray-600">Làm đẹp:</span>{' '}
                <span className="text-gray-800">{review.appearance}</span>
              </p>
            )}
          </div>
        )}

        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-4">
            {review.images.map((image, idx) => (
              <div key={idx} className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity">
                <img
                  src={image}
                  alt={`Review ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
                {idx === 0 && (
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <Play className="w-4 h-4 text-white" />
                    <span className="text-white text-xs ml-1">0:19</span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {review.sellerReply && (
          <div className="bg-gray-50 p-4 rounded-lg mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-gray-800">Phản Hồi Của Người Bán</span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              {review.sellerReply.content}
            </p>
          </div>
        )}

        <div className="flex items-center gap-4">
          <Button variant="ghost" size="sm" className="text-gray-500 hover:text-blue-600">
            <ThumbsUp className="w-4 h-4 mr-1" />
            {review.likes}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ReviewItem;
