import useToast from "@/hooks/use-toast";
import {
  getAccountProfile,
  getAddresses,
} from "@/services/account/api-services";
import { isTResponseData } from "@/utils/compare";
import { useState } from "react";

export default function useGetAllAddress() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
 const [addresses, setAddresses] = useState<API.ResponseAddress[]>([]);

  const getAllAddressApi = async () => {
    setPending(true);
    try {
      const res = await getAddresses();
      if (isTResponseData(res)) {
        setAddresses(res.value.data);
        return res as TResponseData<API.ResponseAddress[]>;
      }
      return null;
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  };
  const defaultAddress = addresses.find((addr) => addr.isDefault);

  return { getAllAddressApi, isPending, addresses, defaultAddress };
}
