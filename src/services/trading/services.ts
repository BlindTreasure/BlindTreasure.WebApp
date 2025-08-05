import { useMutation } from "@tanstack/react-query";
import { createTradeRequestByListingId, respondTradeRequest, lockTradeRequest } from "@/services/trading/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useServiceCreateTradeRequest = (listingId : string) => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.TradeRequest>, TMeta, REQUEST.OfferedInventory>({
    mutationFn: async ( payload: REQUEST.OfferedInventory) => {
      return await createTradeRequestByListingId(listingId, payload);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Tạo yêu cầu giao dịch thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Tạo yêu cầu giao dịch thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceRespondTradeRequest = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.TradeRequest>, TMeta, REQUEST.AcceptTradeRequest>({
    mutationFn: respondTradeRequest,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Chấp nhận thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Đóng listing thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceLockTradeRequest = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.TradeRequest>, TMeta, string>({
    mutationFn: lockTradeRequest,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Khóa thành công!",
        duration: 5000,
      }); 
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Khóa thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};