import { useMutation } from "@tanstack/react-query";
import { createTradeRequestByListingId, respondTradeRequest, lockTradeRequest } from "@/services/trading/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useServiceCreateTradeRequest = (listingId : string) => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.TradeRequest>, Error, REQUEST.OfferedInventory>({
    mutationFn: async ( payload: REQUEST.OfferedInventory) => {
      return await createTradeRequestByListingId(listingId, payload);
    },
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

export const useServiceRespondTradeRequest = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.TradeRequest>, Error, REQUEST.AcceptTradeRequest>({
    mutationFn: respondTradeRequest,
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

export const useServiceLockTradeRequest = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.TradeRequest>, Error, string>({
    mutationFn: lockTradeRequest,
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