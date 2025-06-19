import { useServiceReviewBlindbox } from "@/services/blindboxes/services";
import { BlindBoxReviewRequest } from "@/services/blindboxes/typings";

interface ReviewBlindboxParams {
  blindboxesId: string;
  reviewData: BlindBoxReviewRequest;
}

export default function useReviewBlindbox() {
  const { mutate, isPending } = useServiceReviewBlindbox();

  const onReview = (
    { blindboxesId, reviewData }: ReviewBlindboxParams,
    onSuccessCallback?: () => void
  ) => {
    try {
      mutate(
        { blindboxesId, reviewData },
        {
          onSuccess: () => {
            if (onSuccessCallback) {
              onSuccessCallback();
            }
          },
        }
      );
    } catch (error) {
      console.error("Review blindbox error:", error);
    }
  };

  return {
    onReview,
    isPending,
  };
}