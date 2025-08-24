import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getPayoutSeller } from "@/services/payout/api-services";
import { PayoutHistoryParams, PayoutHistoryResponse } from "@/services/payout/typings";

export default function useGetPayoutSeller() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getPayoutSellerApi = async (params?: PayoutHistoryParams) => {
    setPending(true);
    try {
      const res = await getPayoutSeller(params);
      if (isTResponseData(res)) {
        return res as TResponseData<PayoutHistoryResponse>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getPayoutSellerApi };
}
