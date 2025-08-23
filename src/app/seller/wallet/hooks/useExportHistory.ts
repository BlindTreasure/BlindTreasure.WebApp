import { useState } from "react";
import { exportHistory } from "@/services/payout/api-services";

export default function useExportHistory() {
  const [isPending, setPending] = useState(false);

  const exportHistoryApi = async () => {
    setPending(true);
    try {
      const blob = await exportHistory();
      return blob;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, exportHistoryApi };
}
