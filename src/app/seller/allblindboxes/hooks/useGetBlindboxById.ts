import useToast from "@/hooks/use-toast";
import { getBlindBoxById } from "@/services/blindboxes/api-services";
import { isTResponseData } from "@/utils/compare";
import { BlindBox } from "@/services/blindboxes/typings"
import { useCallback, useState } from "react";

export default function useGetBlindboxById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getBlindboxByIdApi = useCallback(async (blindboxId: string) => {
    setPending(true);
    try {
      const res = await getBlindBoxById(blindboxId);
      if (isTResponseData(res)) {
        return res as TResponseData<BlindBox>;
      } else {
        addToast({
          type: "error",
          description: "Không thể lấy thông tin blindbox",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "Lỗi khi lấy thông tin blindbox",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, [addToast]);

  return { isPending, getBlindboxByIdApi };
}
