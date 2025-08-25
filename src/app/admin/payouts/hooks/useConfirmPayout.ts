"use client";

import useToast from "@/hooks/use-toast";
import { confirmPayout } from "@/services/admin/api-services";
import { ConfirmPayoutRequest, PayoutHistoryItem } from "@/services/admin/typings";
import { useState } from "react";

export default function useConfirmPayout(payoutId?: string) {
  const { addToast } = useToast();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = (
    body: ConfirmPayoutRequest,
    onSuccessCallback?: (data: TResponseData<PayoutHistoryItem>) => void,
    onErrorCallback?: (error: any) => void
  ) => {
    if (!payoutId) {
      console.error("Payout ID is required");
      onErrorCallback?.({ message: "Payout ID is required" });
      return;
    }

    setIsSubmitting(true);

    confirmPayout(payoutId, body)
      .then((data) => {
        setIsSubmitting(false);
        addToast({
          type: "success",
          description: data.value.message,
          duration: 5000,
        });
        onSuccessCallback?.(data);
      })
      .catch((error) => {
        setIsSubmitting(false);
        onErrorCallback?.(error);
      });
  };

  return {
    onSubmit,
    isSubmitting,
  };
}
