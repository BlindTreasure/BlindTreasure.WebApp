
import { getConversation } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetChatConversation() {
  const [isPending, setPending] = useState(false);

  const getChatConversationApi = useCallback(async (params: REQUEST.GetChatConversation) => {
    setPending(true);
    try {
      const res = await getConversation(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseChatConversation>;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getChatConversationApi };
}
