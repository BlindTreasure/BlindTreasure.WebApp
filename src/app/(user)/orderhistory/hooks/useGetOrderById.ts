import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { getOrderDetailById } from "@/services/order/api-services";
import { OrderResponse } from "@/services/order/typings";
import { isTResponseData } from "@/utils/compare";

export default function useGetOrderById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getOrderDetailApi = async (orderId: string) => {
    setPending(true);
    try {
      const res = await getOrderDetailById(orderId);
      if (isTResponseData(res)) {
        return res as TResponseData<OrderResponse>;
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

  return { getOrderDetailApi, isPending };
}
