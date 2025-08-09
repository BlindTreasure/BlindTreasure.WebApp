'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Star, Upload, X, Image, Video } from 'lucide-react';
import { motion } from 'framer-motion';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../ui/tooltip';

interface WriteReviewProps {
  productId: string;
  onSubmit: (reviewData: any) => void;
  onCancel?: () => void;
  isSubmitting?: boolean;
}

const WriteReview: React.FC<WriteReviewProps> = ({ productId, onSubmit, onCancel, isSubmitting: externalIsSubmitting }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState('');
  const [experience, setExperience] = useState('');
  const [appearance, setAppearance] = useState('');
  const [mediaFiles, setMediaFiles] = useState<File[]>([]); 
  const [isSubmitting, setIsSubmitting] = useState(false);
  const actualIsSubmitting = externalIsSubmitting ?? isSubmitting;

  const starDescriptions = {
    1: 'Tệ',
    2: 'Không hài lòng',
    3: 'Bình thường',
    4: 'Hài lòng',
    5: 'Tuyệt vời',
  }
  const handleMediaUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    const currentFiles = mediaFiles.length;

    if (currentFiles + files.length > 5) {
      alert('Tối đa 5 files (ảnh + video)');
      return;
    }

    const videoFiles = files.filter(file => file.type.startsWith('video/'));
    const maxSize = 50 * 1024 * 1024; 
    const oversizedVideos = videoFiles.filter(file => file.size > maxSize);
    if (oversizedVideos.length > 0) {
      alert('Kích thước video không được vượt quá 50MB');
      return;
    }

    setMediaFiles(prev => [...prev, ...files]);
  };

  const removeMediaFile = (index: number) => {
    setMediaFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (rating === 0) {
      alert('Vui lòng chọn số sao đánh giá');
      return;
    }

    if (!comment.trim()) {
      alert('Vui lòng viết nhận xét về sản phẩm');
      return;
    }

    if (externalIsSubmitting === undefined) {
      setIsSubmitting(true);
    }

    try {
      const reviewData = {
        productId,
        rating,
        comment: comment.trim(),
        images: mediaFiles, 
        videos: [] 
      };

      await onSubmit(reviewData);

      setRating(0);
      setComment('');
      setExperience('');
      setAppearance('');
      setMediaFiles([]);
    } catch (error) {
      if (externalIsSubmitting === undefined) {
        alert('Có lỗi xảy ra khi gửi đánh giá. Vui lòng thử lại.');
      }
    } finally {
      if (externalIsSubmitting === undefined) {
        setIsSubmitting(false);
      }
    }
  };

  return (
    <TooltipProvider>
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold text-blue-800">
            Viết đánh giá của bạn
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label className="text-sm font-medium">Đánh giá sao *</Label>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Tooltip key={star}>
                    <TooltipTrigger asChild>
                      <button
                        type="button"
                        className="p-1 hover:scale-110 transition-transform"
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                      >
                        <Star
                          className={`w-8 h-8 ${star <= (hoverRating || rating)
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                            }`}
                        />
                      </button>
                    </TooltipTrigger>
                    <TooltipContent side="top">
                      {starDescriptions[star as keyof typeof starDescriptions]}
                    </TooltipContent>
                  </Tooltip>
                ))}
                <span className="ml-2 text-sm text-gray-600">
                  {rating > 0 && `${rating} sao`}
                </span>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="comment" className="text-sm font-medium">
                Nhận xét về sản phẩm *
              </Label>
              <Textarea
                id="comment"
                placeholder="Chia sẻ trải nghiệm của bạn về sản phẩm này..."
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={4}
                className="resize-none"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Hình ảnh & Video (tối đa 5 files) - Hiện tại: {mediaFiles.length}/5
              </Label>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <input
                    type="file"
                    id="media"
                    multiple
                    accept="image/*,video/*"
                    onChange={handleMediaUpload}
                    className="hidden"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => document.getElementById('media')?.click()}
                    disabled={mediaFiles.length >= 5}
                    className="flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    Tải ảnh/video lên
                  </Button>
                  <span className="text-xs text-gray-500">
                    {mediaFiles.filter(f => f.type.startsWith('image/')).length} ảnh, {mediaFiles.filter(f => f.type.startsWith('video/')).length} video (tổng: {mediaFiles.length}/5)
                  </span>
                </div>

                {mediaFiles.length > 0 && (
                  <div className="grid grid-cols-4 gap-2">
                    {mediaFiles.map((file, index) => (
                      <div key={index} className="relative group">
                        {file.type.startsWith('image/') ? (
                          <img
                            src={URL.createObjectURL(file)}
                            alt={`Preview ${index + 1}`}
                            className="w-full h-20 object-cover rounded border"
                          />
                        ) : (
                          <div className="relative">
                            <video
                              src={URL.createObjectURL(file)}
                              className="w-full h-20 object-cover rounded border"
                              controls={false}
                              muted
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded">
                              <Video className="w-6 h-6 text-white" />
                            </div>
                            <div className="absolute bottom-1 left-1 bg-black bg-opacity-75 text-white text-xs px-1 rounded">
                              {(file.size / (1024 * 1024)).toFixed(1)}MB
                            </div>
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeMediaFile(index)}
                          className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="submit"
                disabled={actualIsSubmitting || rating === 0 || !comment.trim()}
              >
                {actualIsSubmitting ? 'Đang gửi...' : 'Gửi đánh giá'}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={actualIsSubmitting}
                >
                  Hủy
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default WriteReview;
