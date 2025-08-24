import { isTResponseData } from "@/utils/compare";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getPayoutSummary } from "@/services/admin/api-services";
import { PayoutHistoryParams, PayoutHistoryResponse } from "@/services/admin/typings";

export default function useGetPayouts() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getPayoutsApi = async (params?: PayoutHistoryParams) => {
    setPending(true);
    try {
      const res = await getPayoutSummary(params);
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

  return { isPending, getPayoutsApi };
}
