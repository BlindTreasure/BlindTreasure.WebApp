'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2 } from 'lucide-react';
import { Review } from './types';
import useDeleteReview from '@/app/(user)/purchased/hooks/useDeleteReview';
import { useAppSelector } from '@/stores/store';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

interface ReviewItemProps {
  review: Review;
  onReviewDeleted?: (reviewId: string) => void;
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

const ReviewItem: React.FC<ReviewItemProps> = ({ review, onReviewDeleted }) => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [imageDimensions, setImageDimensions] = useState<{ [key: string]: { width: number; height: number } }>({});
  const { onDelete, isPending } = useDeleteReview();
  const galleryRef = useRef<HTMLDivElement>(null);
  const user = useAppSelector((state: any) => state.userSlice.user);
  const getUserId = () => {
    if (!user) return null;
    return user.id || user.userId || user.customerId || user.accountId;
  };

  const currentUserId = getUserId();
  const isOwner = currentUserId && (
    currentUserId === review.userId ||
    String(currentUserId) === String(review.userId)
  );
  const isAdminOrStaff = user && (
    user.roleName === 'Admin' ||
    user.roleName === 'Staff' ||
    user.roleName === 'admin' ||
    user.roleName === 'staff'
  );
  const canDelete = isOwner || isAdminOrStaff;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const handleDeleteReview = () => {
    onDelete(review.id, () => {
      if (onReviewDeleted) {
        onReviewDeleted(review.id);
      }
      setShowDeleteConfirm(false);
    });
  };

  useEffect(() => {
    if (!review.images || review.images.length === 0) return;

    const lightbox = new PhotoSwipeLightbox({
      gallery: galleryRef.current!,
      children: 'a',
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.9,
      showHideAnimationType: 'zoom',
      spacing: 0.1,
      allowPanToNext: true,
      zoom: true,
      close: true,
      arrowKeys: true,
      returnFocus: true,
    });

    lightbox.init();

    return () => {
      lightbox.destroy();
    };
  }, [review.images]);

  return (
    <>
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

            {canDelete && (
              <div className="flex items-center gap-2">
                {!showDeleteConfirm ? (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="text-red-500 hover:text-red-700 hover:bg-red-50"
                    disabled={isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                ) : (
                  <div className="flex items-center gap-2">
                    <span className="text-sm text-gray-600">Xóa đánh giá?</span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={handleDeleteReview}
                      className="text-white border hover:bg-opacity-80 bg-[#d02a2a]"
                      disabled={isPending}
                    >
                      {isPending ? 'Đang xóa...' : 'Xác nhận'}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowDeleteConfirm(false)}
                      className="text-gray-500 border hover:text-gray-700"
                      disabled={isPending}
                    >
                      Hủy
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>

          <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

          {review.images && review.images.length > 0 && (
            <div ref={galleryRef} className="flex gap-2 mb-4">
              {review.images.map((image, idx) => (
                <a
                  key={idx}
                  href={image}
                  data-pswp-width="1200"
                  data-pswp-height="800"
                  className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group block"
                >
                  <img
                    src={image}
                    alt={`Review ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                    <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                      Xem
                    </div>
                  </div>
                </a>
              ))}
            </div>
          )}

          {review.sellerReply && (
            <div className="bg-gray-50 p-4 rounded-lg mb-4">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-medium text-gray-800">
                  {review.sellerReply.sellerName
                    ? `Phản Hồi Từ ${review.sellerReply.sellerName}`
                    : "Phản Hồi Của Người Bán"
                  }
                </span>
                <span className="text-xs text-gray-500">
                  {formatDate(review.sellerReply.createdAt)}
                </span>
              </div>
              <p className="text-gray-700 text-sm leading-relaxed">
                {review.sellerReply.content}
              </p>
            </div>
          )}
        </CardContent>
      </Card>
    </>
  );
};

export default ReviewItem;
