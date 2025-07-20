import { getProvinces } from "@/services/shipping/api-services";
import { ResponseProvinces } from "@/services/shipping/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetProvinces() {
  const [isPending, setPending] = useState(false);
  const [provinces, setProvinces] = useState<ResponseProvinces[]>([]);

  const getProvincesApi = async () => {
    setPending(true);
    try {
      const res = await getProvinces();
      if (isTResponseData(res)) {
        setProvinces(res.value.data);
        return res as TResponseData<ResponseProvinces[]>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getProvincesApi, isPending, provinces };
}
