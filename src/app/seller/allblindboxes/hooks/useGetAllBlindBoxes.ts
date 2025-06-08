import useToast from "@/hooks/use-toast";
import { getAllBlindboxSeller } from "@/services/blindboxes/api-services";
import { BlindBoxListResponse, GetBlindBoxes } from "@/services/blindboxes/typings";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";

export default function useGetAllBlindBoxes() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getAllBlindBoxesApi = async (params: GetBlindBoxes) => {
    setPending(true);
    try {
      const res = await getAllBlindboxSeller(params);
      if (isTResponseData(res)) {
        return res as TResponseData<BlindBoxListResponse>;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, getAllBlindBoxesApi };
}
