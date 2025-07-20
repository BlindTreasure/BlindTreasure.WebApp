import { getDistricts } from "@/services/shipping/api-services";
import { RequestDistricts, ResponseDistricts, ResponseProvinces } from "@/services/shipping/typings";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetDistricts() {
  const [isPending, setPending] = useState(false);
  const [districts, setDistricts] = useState<ResponseDistricts[]>([]);

  const getDistrictsApi = async (param: RequestDistricts) => {
    setPending(true);
    try {
      const res = await getDistricts(param);
      if (isTResponseData(res)) {
        setDistricts(res.value.data);
        return res as TResponseData<ResponseDistricts[]>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };

  return { getDistrictsApi, isPending, districts };
}
