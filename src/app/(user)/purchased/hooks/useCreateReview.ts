import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  reviewSchema,
  ReviewFormData,
  defaultValues,
} from "@/utils/schema-validations/review.schema";
import { useServiceCreateReview } from "@/services/review/services";
import { ReviewCreateRequest } from "@/services/review/typings";

export default function useCreateReview() {
  const form = useForm<ReviewFormData>({
    resolver: zodResolver(reviewSchema),
    defaultValues,
  });

  const { mutate: createReview, isPending } = useServiceCreateReview();

  const onSubmit = async (data: ReviewFormData) => {
    const allFiles = [...(data.images || []), ...(data.videos || [])];

    const reviewData: ReviewCreateRequest = {
      orderDetailId: data.orderDetailId,
      rating: data.rating,
      comment: data.comment,
      images: allFiles,
    };

    return new Promise((resolve, reject) => {
      createReview(reviewData, {
        onSuccess: (result) => {
          form.reset(); 
          resolve(result);
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  return {
    form,
    onSubmit,
    isPending,
  };
}
