import { useMutation } from "@tanstack/react-query";
import { createPromotion, reviewPromotion, updatePromotion, deletePromotion, participantPromotion, withdrawPromotion } from "@/services/promotion/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useServiceCreatePromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Promotion>, Error, REQUEST.PromotionForm>({
    mutationFn: createPromotion,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceReviewPromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Promotion>, Error, REQUEST.ReviewPromotion>({
    mutationFn: reviewPromotion,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceUpdatePromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Promotion>, Error, REQUEST.PromotionForm & { promotionId : string }>({
    mutationFn: updatePromotion,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceDeletePromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Promotion>, Error,{ promotionId : string }>({
    mutationFn: ({promotionId}) =>deletePromotion(promotionId),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceParticipantPromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ParticipantPromotion>, Error,{ promotionId : string }>({
    mutationFn: ({promotionId}) =>participantPromotion(promotionId),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceWithdrawPromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ParticipantPromotion>, Error, REQUEST.withdrawPromotion>({
    mutationFn: withdrawPromotion,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};