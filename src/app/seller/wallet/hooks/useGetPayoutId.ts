import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getPayoutId } from "@/services/payout/api-services";
import { PayoutHistoryItem } from "@/services/payout/typings";

export default function useGetPayoutId() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getPayoutIdApi = async (payoutId: string) => {
    setPending(true);
    try {
      const res = await getPayoutId(payoutId);
      if (isTResponseData(res)) {
        return res as TResponseData<PayoutHistoryItem>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getPayoutIdApi };
}
