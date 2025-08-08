import useToast from "@/hooks/use-toast";
import { getConversation } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetChatConversation() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getChatConversationApi = useCallback(async (params: REQUEST.GetChatConversation) => {
    setPending(true);
    try {
      const res = await getConversation(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseChatConversation>;
      } else {
        addToast({
          type: "error",
          description: "Failed to fetch conversation list",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "An error occurred while fetching conversation list",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getChatConversationApi };
}
