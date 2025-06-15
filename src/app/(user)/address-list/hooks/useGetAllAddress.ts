import useToast from "@/hooks/use-toast";
import { getAccountProfile, getAddresses } from "@/services/account/api-services";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllAddress() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const getAllAddressApi = async () => {
    setPending(true);
    try {
      const res = await getAddresses();
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseAddress[]>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };
  return { getAllAddressApi, isPending };
}
