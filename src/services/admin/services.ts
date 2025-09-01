import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/hooks/error";
import { ConfirmPayoutRequest, PayoutHistoryItem } from "./typings";
import { InventoryItem } from "@/services/inventory-item/typings";
import {
  confirmPayout,
  forceReleaseHold,
  forceTimeout,
  updateInventoryItemStatus,
} from "./api-services";

export const useServiceConfirmPayout = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<PayoutHistoryItem>,
    Error,
    { payoutId: string; body: ConfirmPayoutRequest }
  >({
    mutationFn: ({ payoutId, body }) => confirmPayout(payoutId, body),
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

export const useServiceForceReleaseHold = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<InventoryItem>, Error, string>({
    mutationFn: forceReleaseHold,
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

export const useServiceForceTimeout = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.TradeRequest>, Error, string>({
    mutationFn: forceTimeout,
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

export const useUpdateInventoryItemStatus = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<InventoryItem>,
    Error,
    { id: string; status: string } 
  >({
    mutationFn: ({ id, status }) => updateInventoryItemStatus(id, status),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};
