import { viewAllTradeRequest } from "@/services/trading/api-services";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllTradeRequest() {
  const [isPending, setPending] = useState(false);

  const getAllTradeRequestApi = async (params : REQUEST.ParamsGetAllTradeRequest) => {
    setPending(true);
    try {
      const res = await viewAllTradeRequest();
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseDataTradeRequest>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getAllTradeRequestApi };
}
