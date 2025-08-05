import useToast from "@/hooks/use-toast";
import { viewTradeRequestHistory } from "@/services/trading/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetTradeRequestHistory() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getTradeRequestHistoryApi = useCallback(async (params: REQUEST.ViewTradingHistory) => {
    setPending(true);
    try {
      const res = await viewTradeRequestHistory(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseDataTradeHistory>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch trading history",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching history",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getTradeRequestHistoryApi };
}
