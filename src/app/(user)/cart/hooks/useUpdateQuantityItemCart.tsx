import { updateCartItemByCustomer } from "@/services/cart-item/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useRef, useState } from "react";

export default function useUpdateQuantityItemCart() {
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);

  const updateCartItemApi = useCallback(async (
    body: { cartItemId: string; quantity: number }) => 
    {
    setPending(true);
    try {
      const res = await updateCartItemByCustomer(body);
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

  return { isPending, updateCartItemApi };
}
