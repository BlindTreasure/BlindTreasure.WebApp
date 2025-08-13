import { useState, useCallback } from "react";
import { getOrdersByGroup } from "@/services/order/api-services";
import { OrderResponse } from "@/services/order/typings";
import { isTResponseData } from "@/utils/compare";

export default function useGetOrdersByGroup() {
  const [isPending, setPending] = useState(false);

  const getOrdersByGroupApi = useCallback(
    async (groupId: string) => {
      setPending(true);
      try {
        const res = await getOrdersByGroup(groupId);
        if (isTResponseData(res)) {
          return res as TResponseData<OrderResponse[]>;
        }
        return null;
      } catch (error) {
        console.error("Error in getOrdersByGroup:", error);
        return null;
      } finally {
        setPending(false);
      }
    },
    []
  );

  return { getOrdersByGroupApi, isPending };
}
