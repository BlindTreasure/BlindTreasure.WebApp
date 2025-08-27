import { getHistoryAI } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetChatHistoryAI() {
  const [isPending, setPending] = useState(false);

  const getChatHistoryAIApi = useCallback(async (params: REQUEST.GetChatConversation) => {
    setPending(true);
    try {
      const res = await getHistoryAI(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseChatHistoryDetail>;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getChatHistoryAIApi };
}
