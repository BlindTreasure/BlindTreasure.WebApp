import { getCartByCustomer } from "@/services/cart-item/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useRef, useState } from "react";

export default function useGetCartByCustomer() {
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const getCartApi = useCallback(async () => {
    setPending(true);
    try {
      const res = await getCartByCustomer();
      if (isTResponseData(res)) {
        return res as TResponseData<API.ResponseDataCart>;
      } else {
        return null;
      }
    } catch (error) {
      return null;
    } finally {
      setPending(false);
    }
  }, []);

  return { isPending, getCartApi };
}
