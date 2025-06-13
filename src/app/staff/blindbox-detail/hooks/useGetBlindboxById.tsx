import useToast from "@/hooks/use-toast";
import { getBlindboxById } from "@/services/blindboxes/api-services";
import { isTResponseData } from "@/utils/compare";
import { BlindBox } from "@/services/blindboxes/typings"
import { useCallback, useState } from "react";

export default function useGetBlindboxById() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getBlindboxByIdApi = useCallback(async (blindboxId: string) => {
    setPending(true);
    try {
      const res = await getBlindboxById(blindboxId);
      if (isTResponseData(res)) {
        return res as TResponseData<BlindBox>;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, [addToast]);

  return { isPending, getBlindboxByIdApi };
}
