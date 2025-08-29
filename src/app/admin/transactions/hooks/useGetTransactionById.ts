import { useState } from "react";
import useToast from "@/hooks/use-toast";
import { isTResponseData } from "@/utils/compare";
import { getTransactionId } from "@/services/admin/api-services";
import { StripeTransaction } from "@/services/admin/typings";

export default function useGetTransactionById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getTransactionDetailApi = async (id: string) => {
    setPending(true);
    try {
      const res = await getTransactionId(id);
      if (isTResponseData(res)) {
        return res as TResponseData<StripeTransaction>;
      }
      addToast({
        type: "error",
        description: "Không tìm thấy giao dịch.",
      });
      return null;
    } catch (error) {
      addToast({
        type: "error",
        description: "Đã xảy ra lỗi khi lấy giao dịch.",
      });
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getTransactionDetailApi, isPending };
}
