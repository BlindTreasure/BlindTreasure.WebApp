"use client";

import React, { useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Star, MessageCircle, Send } from "lucide-react";
import { ReviewResponse } from "@/services/review/typings";
import useReply from "../hooks/useReply";

interface ReviewItemWithReplyProps {
  review: ReviewResponse;
  onReplySuccess?: () => void;
}

const StarRating: React.FC<{ rating: number; size?: "sm" | "md" }> = ({
  rating,
  size = "sm",
}) => {
  const sizeClass = size === "sm" ? "w-4 h-4" : "w-5 h-5";

  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <Star
          key={star}
          className={`${sizeClass} ${
            star <= rating
              ? "fill-yellow-400 text-yellow-400"
              : "text-gray-300"
          }`}
        />
      ))}
    </div>
  );
};

const ReviewItemWithReply: React.FC<ReviewItemWithReplyProps> = ({
  review,
  onReplySuccess,
}) => {
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { register, handleSubmit, errors, onSubmit, isPending, reset } =
    useReply(review.id);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const handleReplySubmit = (data: { content: string }) => {
    onSubmit(
      data,
      () => {
        setShowReplyForm(false);
        reset();
        onReplySuccess?.();
      },
      (error) => {
        console.error("Reply error:", error);
      }
    );
  };

  const handleCancelReply = () => {
    setShowReplyForm(false);
    reset();
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
              <span className="font-medium text-gray-800">
                {review.userName}
              </span>
              <StarRating rating={review.rating} />
            </div>
            <p className="text-sm text-gray-500">
              {formatDate(review.createdAt)} | {review.category}
              {review.itemName && ` | ${review.itemName}`}
            </p>
          </div>

          {!review.sellerReply && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowReplyForm(!showReplyForm)}
              className="flex items-center gap-2"
            >
              <MessageCircle className="w-4 h-4" />
              Phản hồi
            </Button>
          )}
        </div>

        <p className="text-gray-700 mb-4 leading-relaxed">{review.comment}</p>

        {review.images && review.images.length > 0 && (
          <div className="flex gap-2 mb-4">
            {review.images.map((image, idx) => (
              <div
                key={idx}
                className="relative w-20 h-20 bg-gray-100 rounded-lg overflow-hidden"
              >
                <img
                  src={image}
                  alt={`Review ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        )}

        {review.sellerReply && (
          <div className="bg-blue-50 p-4 rounded-lg mb-4">
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
            <p className="text-blue-700 text-sm leading-relaxed">
              {review.sellerReply.content}
            </p>
          </div>
        )}

        {showReplyForm && !review.sellerReply && (
          <div className="bg-gray-50 p-4 rounded-lg">
            <form onSubmit={handleSubmit(handleReplySubmit)}>
              <div className="mb-3">
                <Textarea
                  {...register("content")}
                  placeholder="Nhập phản hồi của bạn..."
                  className="min-h-[100px] resize-none"
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
                  size="sm"
                  onClick={handleCancelReply}
                  disabled={isPending}
                >
                  Hủy
                </Button>
                <Button
                  type="submit"
                  size="sm"
                  disabled={isPending}
                  className="flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  {isPending ? "Đang gửi..." : "Gửi phản hồi"}
                </Button>
              </div>
            </form>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReviewItemWithReply;
