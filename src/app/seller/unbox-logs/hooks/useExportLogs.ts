import { isTResponseData } from "@/utils/compare";
import { exportUnboxLogs } from "@/services/unbox/api-services";
import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { ExportUnboxLogsParams } from "@/services/unbox/typings";

export default function useExportLogs() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const exportLogsApi = async (params: ExportUnboxLogsParams) => {
    setPending(true);
    try {
      const res = await exportUnboxLogs(params);
      return res;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, exportLogsApi };
}
