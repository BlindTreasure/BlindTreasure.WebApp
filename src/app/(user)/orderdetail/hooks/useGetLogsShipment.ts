import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { isTResponseData } from "@/utils/compare";
import { getShipmentLogs } from "@/services/shipment/api-services";
import { OrderLog } from "@/services/shipment/typings";

export default function useGetLogsShipment() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getLogsShipmentApi = async (id: string) => {
    setPending(true);
    try {
      const res = await getShipmentLogs(id);
      if (isTResponseData(res)) {
        return res as TResponseData<OrderLog[]>;
      }
      addToast({
        type: "error",
        description: "Không tìm thấy đơn hàng.",
      });
      return null;
    } catch (error) {
      addToast({
        type: "error",
        description: "Đã xảy ra lỗi khi lấy đơn hàng.",
      });
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getLogsShipmentApi, isPending };
}
