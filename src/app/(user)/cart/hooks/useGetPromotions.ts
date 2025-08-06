import useToast from "@/hooks/use-toast";
import { getAllPromotion } from "@/services/promotion/api-services";
import { PromotionStatus } from "@/const/promotion";
import { RPromotion } from "@/services/promotion/typing";
import { isTResponseData } from "@/utils/compare";
import { useState, useCallback } from "react";

export default function useGetPromotions() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getPromotionsApi = useCallback(
    async (sellerId?: string) => {
      setPending(true);
      try {
        const res = await getAllPromotion({
          status: PromotionStatus.Approved, 
          isParticipated: true,
          participantSellerId: sellerId || undefined,
          pageIndex: 1,
          pageSize: 100, 
        });
        if (isTResponseData(res)) {
          return res as TResponseData<RPromotion>;
        }
        return null;
      } catch (error) {
        addToast({
          type: "error",
          description: "Không thể tải danh sách mã khuyến mãi.",
          duration: 5000,
        });
        return null;
      } finally {
        setPending(false);
      }
    },
    [addToast]
  );

  return { getPromotionsApi, isPending };
}
