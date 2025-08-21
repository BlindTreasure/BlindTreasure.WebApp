import { sendInventoryItem } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useSendInventoryItemUser() {
  const [isPending, setPending] = useState(false);

  const useSendInventoryItemUserApi = useCallback(async (params: REQUEST.SendInventoryItemToUser) => {
    setPending(true);
    try {
      const res = await sendInventoryItem(params);
      if (isTResponseData(res)) {
        return res as TResponseData;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, useSendInventoryItemUserApi };
}
