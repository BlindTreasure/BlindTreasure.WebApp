import { getUnreadCount } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetUnreadCount() {
  const [isPending, setPending] = useState(false);

  const getUnreadCountApi = useCallback(async () => {
    setPending(true);
    try {
      const res = await getUnreadCount();
      if (isTResponseData(res)) {
        return res as TResponseData<number>;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getUnreadCountApi };
}
