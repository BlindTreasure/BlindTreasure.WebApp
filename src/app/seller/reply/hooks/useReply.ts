"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  replySchema,
  ReplyFormData,
  defaultValues,
} from "@/utils/schema-validations/reply.schema";
import { useServiceReplyReview } from "@/services/review/services";
import { useState } from "react";

export default function useReply(reviewId?: string) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    setValue,
  } = useForm<ReplyFormData>({
    resolver: zodResolver(replySchema),
    defaultValues,
  });

  const { mutate, isPending } = useServiceReplyReview();

  const onSubmit = (
    data: ReplyFormData,
    onSuccessCallback?: () => void,
    onErrorCallback?: (error: any) => void
  ) => {
    if (!reviewId) {
      console.error("Review ID is required");
      onErrorCallback?.({ message: "Review ID is required" });
      return;
    }

    setIsSubmitting(true);

    try {
      mutate(
        {
          reviewId,
          body: {
            content: data.content,
          },
        },
        {
          onSuccess: () => {
            reset();
            setIsSubmitting(false);
            onSuccessCallback?.();
          },
          onError: (error) => {
            setIsSubmitting(false);
            onErrorCallback?.(error);
          },
        }
      );
    } catch (err) {
      setIsSubmitting(false);
      console.error("Reply submission error:", err);
      onErrorCallback?.(err);
    }
  };

  const content = watch("content");

  return {
    register,
    handleSubmit,
    errors,
    reset,
    onSubmit,
    isPending: isPending || isSubmitting,
    content,
    setValue,
  };
}
