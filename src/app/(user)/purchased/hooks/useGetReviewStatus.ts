import { getReviewStats } from "@/services/review/api-services";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetReviewStatus() {
  const [isPending, setPending] = useState(false);

  const getReviewStatusApi = async (orderDetailId: string) => {
    setPending(true);
    try {
      const res = await getReviewStats(orderDetailId);
      if (isTResponseData(res)) {
        return res as TResponseData<boolean>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getReviewStatusApi, isPending };
}
