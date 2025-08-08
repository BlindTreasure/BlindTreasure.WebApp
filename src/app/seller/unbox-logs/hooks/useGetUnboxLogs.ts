import { isTResponseData } from "@/utils/compare";
import { getUnboxLogs } from "@/services/unbox/api-services";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { GetUnboxLogsParams, ResponseUnboxLogs, ResponseUnboxLogsList } from "@/services/unbox/typings";

export default function useGetUnboxLogs() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getUnboxLogsApi = async (params: GetUnboxLogsParams) => {
    setPending(true);
    try {
      const res = await getUnboxLogs(params);
      if (isTResponseData(res)) {
        return res as TResponseData<ResponseUnboxLogsList>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getUnboxLogsApi };
}
