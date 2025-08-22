import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { isTResponseData } from "@/utils/compare";
import { getOrderById } from "@/services/product-seller/api-services";
import { Order } from "@/services/product-seller/typings";

export default function useGetOrderById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getOrderDetailApi = async (orderId: string) => {
    setPending(true);
    try {
      const res = await getOrderById(orderId);
      if (isTResponseData(res)) {
        return res as TResponseData<Order>;
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
