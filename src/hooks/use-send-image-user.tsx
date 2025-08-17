import { sendImage } from "@/services/chat/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";

export default function useSendImageUser() {
  const [isPending, setPending] = useState(false);

  const useSendImageUserApi = useCallback(async (params: REQUEST.SendImageToUser) => {
    setPending(true);
    try {
      const res = await sendImage(params);
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

  return { isPending, useSendImageUserApi };
}
