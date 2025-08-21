import { getHistoryConversationDetail } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useGetChatHistoryDetail() {
  const [isPending, setPending] = useState(false);

  const getChatHistoryDetailApi = useCallback(async (params: REQUEST.GetChatHistoryDetail) => {
    setPending(true);
    try {
      const res = await getHistoryConversationDetail(params);
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

  return { isPending, getChatHistoryDetailApi };
}
