import { useServiceDeleteReview } from "@/services/review/services";

export default function useDeleteReview() {
  const { mutate: deleteReview, isPending } = useServiceDeleteReview();

  const onDelete = (reviewId: string, onSuccessCallback?: () => void) => {
    try {
      deleteReview(reviewId, {
        onSuccess: () => {
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
      });
    } catch (error) {
    }
  };

  return {
    onDelete,
    isPending,
  };
}
