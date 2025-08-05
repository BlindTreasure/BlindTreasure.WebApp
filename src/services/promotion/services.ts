import { useMutation } from "@tanstack/react-query";
import { createPromotion, reviewPromotion, updatePromotion, deletePromotion, participantPromotion, withdrawPromotion } from "@/services/promotion/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useServiceCreatePromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Promotion>, TMeta, REQUEST.PromotionForm>({
    mutationFn: createPromotion,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Tạo khuyến mãi thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Tạo khuyến mãi thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceReviewPromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Promotion>, TMeta, REQUEST.ReviewPromotion>({
    mutationFn: reviewPromotion,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Xét duyệt khuyến mãi thành công",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Xét duyệt khuyến mãi thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceUpdatePromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Promotion>, TMeta, REQUEST.PromotionForm & { promotionId : string }>({
    mutationFn: updatePromotion,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Chỉnh sửa khuyến mãi thành công",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Chỉnh sửa khuyến mãi thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceDeletePromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Promotion>, TMeta,{ promotionId : string }>({
    mutationFn: ({promotionId}) =>deletePromotion(promotionId),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Xóa khuyến mãi thành công",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Xóa khuyến mãi thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceParticipantPromotion = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ParticipantPromotion>, TMeta,{ promotionId : string }>({
    mutationFn: ({promotionId}) =>participantPromotion(promotionId),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Tham gia chiến dịch khuyến mãi thành công",
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

  return useMutation<TResponseData<API.ParticipantPromotion>, TMeta, REQUEST.withdrawPromotion>({
    mutationFn: withdrawPromotion,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Rút khỏi chiến dịch khuyến mãi thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};