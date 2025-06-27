import useToast from "@/hooks/use-toast";
import { getBlindBoxById } from "@/services/blindboxes/api-services";
import { BlindBox, BlindBoxListResponse } from "@/services/blindboxes/typings";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";

export default function useGetBlindboxByIdWeb() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getBlindboxByIdWebApi = async (blindboxId: string) => {
    setPending(true);
    try {
      const res = await getBlindBoxById(blindboxId);
      if (isTResponseData(res)) {
        return res as TResponseData<BlindBox>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getBlindboxByIdWebApi };
}

