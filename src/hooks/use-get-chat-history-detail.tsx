import useToast from "@/hooks/use-toast";
import { getHistoryConversationDetail } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetChatHistoryDetail() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getChatHistoryDetailApi = useCallback(async (params: REQUEST.GetChatHistoryDetail) => {
    setPending(true);
    try {
      const res = await getHistoryConversationDetail(params);
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseChatHistoryDetail>;
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

  return { isPending, getChatHistoryDetailApi };
}
