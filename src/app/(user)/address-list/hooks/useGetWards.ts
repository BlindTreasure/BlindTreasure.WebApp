import { getWards } from "@/services/shipping/api-services";
import { RequestWards, ResponseWards } from "@/services/shipping/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetWards() {
  const [isPending, setPending] = useState(false);
  const [wards, setWards] = useState<ResponseWards[]>([]);

  const getWardsApi = async (param: RequestWards) => {
    setPending(true);
    try {
      const res = await getWards(param);
      if (isTResponseData(res)) {
        setWards(res.value.data);
        return res as TResponseData<ResponseWards[]>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getWardsApi, isPending, wards };
}
