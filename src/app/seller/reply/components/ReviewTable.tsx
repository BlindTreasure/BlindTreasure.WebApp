"use client";

import React, { useState, useRef, useEffect } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Star, MessageCircle, Eye, Play } from "lucide-react";
import { ReviewResponse } from "@/services/review/typings";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import useReply from "../hooks/useReply";
import PhotoSwipeLightbox from 'photoswipe/lightbox';
import 'photoswipe/style.css';

interface ReviewTableProps {
  reviews: ReviewResponse[];
  onReplySuccess?: () => void;
}

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

const isVideoFile = (url: string): boolean => {
  const videoExtensions = ['.mp4', '.mov', '.avi', '.webm', '.mkv', '.flv', '.wmv', '.m4v'];
  const lowerUrl = url.toLowerCase();
  return videoExtensions.some(ext => lowerUrl.includes(ext)) ||
    lowerUrl.includes('video/') ||
    lowerUrl.includes('youtube.com') ||
    lowerUrl.includes('vimeo.com');
};

const StarRating: React.FC<{ rating: number; size?: "sm" | "md" }> = ({
  rating,
  size = "sm",
}) => {
  const sizeClass = size === "sm" ? "w-3 h-3" : "w-4 h-4";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${star <= rating
            ? "fill-yellow-400 text-yellow-400"
            : "text-gray-300"
            }`}
        />
      ))}
    </div>
  );
};

const ViewReplyDialog: React.FC<{
  review: ReviewResponse;
  onOpenPhotoSwipe: (mediaList: string[], startIndex: number) => void;
}> = ({ review, onOpenPhotoSwipe }) => {
  const [open, setOpen] = useState(false);

  const hasVideo = review.images?.some(media => isVideoFile(media)) || false;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Eye className="w-4 h-4" />
          Xem
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Chi tiết đánh giá và phản hồi</DialogTitle>
        </DialogHeader>
        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={review.userAvatar} />
              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{review.userName}</span>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-gray-500">
                {formatDate(review.createdAt)}
              </p>
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>

          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.images.map((media, idx) => {
                const isVideo = isVideoFile(media);
                return (
                  <div
                    key={idx}
                    className="w-16 h-16 bg-gray-100 rounded overflow-hidden relative cursor-pointer"
                    onClick={() => onOpenPhotoSwipe(review.images, idx)}
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
                          <Play className="w-3 h-3 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={media}
                        alt={`Review media ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {review.sellerReply && (
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <span className="font-medium text-blue-800">
                {review.sellerReply.sellerName
                  ? `Phản Hồi Từ ${review.sellerReply.sellerName}`
                  : "Phản Hồi Của Bạn"}
              </span>
              <span className="text-xs text-blue-600">
                {formatDate(review.sellerReply.createdAt)}
              </span>
            </div>
            <p className="text-blue-700">{review.sellerReply.content}</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

const ReplyDialog: React.FC<{
  review: ReviewResponse;
  onReplySuccess?: () => void;
  onOpenPhotoSwipe: (mediaList: string[], startIndex: number) => void;
}> = ({ review, onReplySuccess, onOpenPhotoSwipe }) => {
  const [open, setOpen] = useState(false);
  const { register, handleSubmit, errors, onSubmit, isPending, reset } =
    useReply(review.id);

  const handleReplySubmit = (data: { content: string }) => {
    onSubmit(
      data,
      () => {
        setOpen(false);
        reset();
        onReplySuccess?.();
      },
      (error) => {
        console.error("Reply error:", error);
      }
    );
  };

  const handleClose = () => {
    setOpen(false);
    reset();
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <MessageCircle className="w-4 h-4" />
          Phản hồi
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Phản hồi đánh giá</DialogTitle>
        </DialogHeader>

        <div className="bg-gray-50 p-4 rounded-lg mb-4">
          <div className="flex items-start gap-3 mb-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={review.userAvatar} />
              <AvatarFallback>{review.userName.charAt(0)}</AvatarFallback>
            </Avatar>
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-medium">{review.userName}</span>
                <StarRating rating={review.rating} />
              </div>
              <p className="text-sm text-gray-500">
                {new Date(review.createdAt).toLocaleDateString("vi-VN")}
              </p>
            </div>
          </div>
          <p className="text-gray-700">{review.comment}</p>

          {review.images && review.images.length > 0 && (
            <div className="flex gap-2 mt-3">
              {review.images.map((media, idx) => {
                const isVideo = isVideoFile(media);
                return (
                  <div
                    key={idx}
                    className="w-16 h-16 bg-gray-100 rounded overflow-hidden relative cursor-pointer"
                    onClick={() => onOpenPhotoSwipe(review.images, idx)}
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
                          <Play className="w-3 h-3 text-white" />
                        </div>
                      </>
                    ) : (
                      <img
                        src={media}
                        alt={`Review media ${idx + 1}`}
                        className="w-full h-full object-cover"
                      />
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit(handleReplySubmit)}>
          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Phản hồi của bạn
            </label>
            <Textarea
              {...register("content")}
              placeholder="Nhập phản hồi của bạn..."
              className="min-h-[120px] resize-none"
              disabled={isPending}
            />
            {errors.content && (
              <p className="text-red-500 text-sm mt-1">
                {errors.content.message}
              </p>
            )}
          </div>

          <div className="flex gap-2 justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={isPending}
            >
              Hủy
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? "Đang gửi..." : "Gửi phản hồi"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

const ReviewTable: React.FC<ReviewTableProps> = ({ reviews, onReplySuccess }) => {
  const lightboxRef = useRef<PhotoSwipeLightbox | null>(null);

  useEffect(() => {
    lightboxRef.current = new PhotoSwipeLightbox({
      gallery: '.review-media-gallery',
      children: 'a',
      pswpModule: () => import('photoswipe'),
      bgOpacity: 0.9,
      showHideAnimationType: 'zoom',
      dataSource: [],
    });

    lightboxRef.current.addFilter('itemData', (itemData) => {
      if (itemData.type === 'video') {
        return {
          ...itemData,
          html: `
            <div class="pswp__video-wrap">
              <video
                controls
                preload="metadata"
                style="width: 100%; height: 100%; object-fit: contain;"
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

    lightboxRef.current.init();

    return () => {
      if (lightboxRef.current) {
        lightboxRef.current.destroy();
        lightboxRef.current = null;
      }
    };
  }, []);

  const openPhotoSwipe = async (mediaList: string[], startIndex: number) => {
    if (!lightboxRef.current) return;

    const items = await Promise.all(
      mediaList.map(async (media) => {
        const isVideo = isVideoFile(media);

        if (isVideo) {
          const dimensions = await getVideoDimensions(media);
          return {
            src: media,
            width: dimensions.width,
            height: dimensions.height,
            type: 'video',
            html: `
              <div class="pswp__video-wrap" style="width: 100%; height: 100%; display: flex; align-items: center; justify-content: center;">
                <video
                  controls
                  preload="metadata"
                  style="max-width: 100%; max-height: 100%; object-fit: contain;"
                  src="${media}"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            `
          };
        } else {
          const dimensions = await getImageDimensions(media);
          return {
            src: media,
            width: dimensions.width,
            height: dimensions.height,
            type: 'image'
          };
        }
      })
    );

    lightboxRef.current.loadAndOpen(startIndex, items);
  };
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
    });
  };

  const truncateText = (text: string, maxLength: number = 100) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength) + "...";
  };



  return (
    <div className="overflow-hidden review-media-gallery">
      <Table>
        <TableHeader>
          <TableRow className="border-b border-gray-200">
            <TableHead className="text-left text-gray-600 font-medium py-3 px-4">Khách hàng</TableHead>
            <TableHead className="text-left text-gray-600 font-medium py-3 px-4">Đánh giá</TableHead>
            <TableHead className="text-left text-gray-600 font-medium py-3 px-4">Nội dung</TableHead>
            <TableHead className="text-left text-gray-600 font-medium py-3 px-4">Ngày tạo</TableHead>
            <TableHead className="text-left text-gray-600 font-medium py-3 px-4">Trạng thái</TableHead>
            <TableHead className="text-left text-gray-600 font-medium py-3 px-4">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {reviews.map((review) => (
            <TableRow key={review.id} className="border-b border-gray-100 hover:bg-gray-50">
              <TableCell className="py-4 px-4">
                <div className="flex items-center gap-3">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src={review.userAvatar} />
                    <AvatarFallback className="text-sm font-medium bg-blue-500 text-white">
                      {review.userName.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium text-sm text-gray-900">{review.userName}</p>
                    <p className="text-xs text-gray-500">
                      {review.category}
                    </p>
                  </div>
                </div>
              </TableCell>

              <TableCell className="py-4 px-4">
                <StarRating rating={review.rating} />
              </TableCell>

              <TableCell className="py-4 px-4">
                <div>
                  <p className="text-sm text-gray-700 leading-relaxed mb-2">
                    {truncateText(review.comment)}
                  </p>
                  {review.images && review.images.length > 0 && (
                    <div className="flex gap-2 mt-3">
                      {review.images.slice(0, 3).map((media, idx) => {
                        const isVideo = isVideoFile(media);

                        return (
                          <div
                            key={idx}
                            className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow cursor-pointer relative"
                            onClick={() => openPhotoSwipe(review.images, idx)}
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
                                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
                                    <path d="M8 5v14l11-7z" />
                                  </svg>
                                </div>
                              </>
                            ) : (
                              <img
                                src={media}
                                alt={`Review media ${idx + 1}`}
                                className="w-full h-full object-cover hover:scale-105 transition-transform"
                              />
                            )}
                          </div>
                        );
                      })}
                      {review.images.length > 3 && (
                        <div className="w-12 h-12 bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center shadow-sm">
                          <span className="text-xs font-medium text-gray-600">
                            +{review.images.length - 3}
                          </span>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </TableCell>

              <TableCell className="py-4 px-4">
                <span className="text-sm text-gray-600">
                  {formatDate(review.createdAt)}
                </span>
              </TableCell>

              <TableCell className="py-4 px-4">
                {review.sellerReply ? (
                  <Badge variant="default" className="text-xs bg-green-100 text-green-800 hover:bg-green-200">
                    Đã phản hồi
                  </Badge>
                ) : (
                  <Badge variant="destructive" className="text-xs bg-red-100 text-red-800 hover:bg-red-200">
                    Chưa phản hồi
                  </Badge>
                )}
              </TableCell>

              <TableCell className="py-4 px-4">
                <div className="flex gap-2">
                  {!review.sellerReply && (
                    <ReplyDialog review={review} onReplySuccess={onReplySuccess} onOpenPhotoSwipe={openPhotoSwipe} />
                  )}
                  {review.sellerReply && (
                    <ViewReplyDialog review={review} onOpenPhotoSwipe={openPhotoSwipe} />
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default ReviewTable;
