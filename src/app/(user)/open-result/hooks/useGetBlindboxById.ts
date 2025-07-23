import useToast from "@/hooks/use-toast";
import { getBlindBoxById } from "@/services/blindboxes/api-services";
import { BlindBox } from "@/services/blindboxes/typings";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState, useEffect, useRef } from "react";

export default function useGetBlindboxById(blindBoxId?: string) {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const [blindBox, setBlindBox] = useState<BlindBox | null>(null);
  const hasCalledRef = useRef(false);

  const getBlindboxByIdApi = useCallback(
    async (blindboxId: string) => {
      if (!blindboxId) return null;

      setPending(true);
      try {
        const res = await getBlindBoxById(blindboxId);

        if (isTResponseData(res)) {
          const blindBoxData = (res as TResponseData<BlindBox>).value.data;
          setBlindBox(blindBoxData);
          return blindBoxData;
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
    },
    [addToast]
  );

  useEffect(() => {
    if (blindBoxId && !hasCalledRef.current) {
      hasCalledRef.current = true;
      getBlindboxByIdApi(blindBoxId);
    }
  }, [blindBoxId, getBlindboxByIdApi]);

  return { isPending, blindBox, getBlindboxByIdApi };
}
