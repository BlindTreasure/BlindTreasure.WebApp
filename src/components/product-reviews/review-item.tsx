'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Star, Trash2, Play } from 'lucide-react';
import { Review } from './types';
import useDeleteReview from '@/app/(user)/purchased/hooks/useDeleteReview';
import { useAppSelector } from '@/stores/store';
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

interface ReviewItemProps {
  review: Review;
  onReviewDeleted?: (reviewId: string) => void;
}

const isVideoFile = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext)) ||
    lowerUrl.includes('video/') ||
    lowerUrl.includes('youtube.com') ||
    lowerUrl.includes('vimeo.com');
};

const getImageDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      resolve({ width: img.naturalWidth, height: img.naturalHeight });
    };
    img.onerror = () => {
      resolve({ width: 800, height: 600 }); 
    };
    img.src = src;
  });
};

const getVideoDimensions = (src: string): Promise<{ width: number; height: number }> => {
  return new Promise((resolve) => {
    const video = document.createElement('video');
    video.onloadedmetadata = () => {
      resolve({ width: video.videoWidth || 800, height: video.videoHeight || 600 });
    };
    video.onerror = () => {
      resolve({ width: 800, height: 600 }); 
    };
    video.src = src;
  });
};

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
  const [mediaDimensions, setMediaDimensions] = useState<{ [key: string]: { width: number; height: number; type: string } }>({});
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

    const loadDimensions = async () => {
      const dimensions: { [key: string]: { width: number; height: number; type: string } } = {};

      for (let i = 0; i < review.images!.length; i++) {
        const media = review.images![i];
        const isVideo = isVideoFile(media);

        try {
          if (isVideo) {
            const dims = await getVideoDimensions(media);
            dimensions[media] = { ...dims, type: 'video' };
          } else {
            const dims = await getImageDimensions(media);
            dimensions[media] = { ...dims, type: 'image' };
          }
        } catch (error) {
          dimensions[media] = { width: 800, height: 600, type: isVideo ? 'video' : 'image' };
        }
      }

      setMediaDimensions(dimensions);
    };

    loadDimensions();
  }, [review.images]);

  useEffect(() => {
    if (!review.images || review.images.length === 0 || Object.keys(mediaDimensions).length === 0) return;

    const initPhotoSwipe = async () => {
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

      lightbox.addFilter('itemData', (itemData) => {
        if (itemData.type === 'video') {
          return {
            ...itemData,
            html: `
              <div class="w-full h-full flex items-center justify-center bg-transparent">
                <video
                  controls
                  preload="metadata"
                  class="max-w-full max-h-full object-contain bg-transparent"
                  src="${itemData.src}"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            `
          };
        }
        return itemData;
      });

      const style = document.createElement('style');
      style.textContent = `
        .pswp {
          --pswp-bg: rgba(0, 0, 0, 0.9);
        }
        .pswp video {
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
        }
      `;
      document.head.appendChild(style);

      lightbox.init();

      return () => {
        lightbox.destroy();
        if (style.parentNode) {
          style.parentNode.removeChild(style);
        }
      };
    };

    const cleanup = initPhotoSwipe();
    return () => {
      cleanup.then(cleanupFn => cleanupFn && cleanupFn());
    };
  }, [review.images, mediaDimensions]);

  return (
    <>
      <Card className="overflow-hidden border-0 shadow-none">
        <CardContent className="p-6 border-b">
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
              {review.images.map((media, idx) => {
                const mediaInfo = mediaDimensions[media];
                const isVideo = mediaInfo?.type === 'video' || isVideoFile(media);
                const dimensions = mediaInfo || { width: 800, height: 600, type: isVideo ? 'video' : 'image' };

                return (
                  <a
                    key={idx}
                    href={media}
                    data-pswp-width={dimensions.width}
                    data-pswp-height={dimensions.height}
                    data-pswp-type={dimensions.type}
                    className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden cursor-pointer hover:opacity-80 transition-opacity group block"
                  >
                    {isVideo ? (
                      <>
                        <video
                          src={media}
                          className="w-full h-full object-cover"
                          muted
                          preload="metadata"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-30 flex items-center justify-center">
                          <Play className="w-4 h-4 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={media}
                        alt={`Review media ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-200 flex items-center justify-center">
                      <div className="text-white opacity-0 group-hover:opacity-100 transition-opacity text-xs">
                        {isVideo ? 'Phát' : 'Xem'}
                      </div>
                    </div>
                  </a>
                );
              })}
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
