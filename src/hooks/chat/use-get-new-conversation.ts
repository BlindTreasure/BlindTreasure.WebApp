
import { getNewConversation } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetNewChatConversation() {
  const [isPending, setPending] = useState(false);

  const getNewChatConversationApi = useCallback(async (receiverId: string) => {
    setPending(true);
    try {
      const res = await getNewConversation(receiverId);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ChatConversation>;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getNewChatConversationApi };
}
