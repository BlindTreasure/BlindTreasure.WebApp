import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/hooks/error";
import { ConfirmPayoutRequest, PayoutHistoryItem } from "./typings";
import { confirmPayout } from "./api-services";

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
