import { updateCartItemByCustomer } from "@/services/cart-item/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useRef, useState } from "react";
import { useAppDispatch } from "@/stores/store";
import { setCart } from "@/stores/cart-slice";

export default function useUpdateQuantityItemCart() {
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);
  const dispatch = useAppDispatch();

  const updateCartItemApi = useCallback(async (
    body: { cartItemId: string; quantity: number }) => 
    {
    setPending(true);
    try {
      const res = await updateCartItemByCustomer(body);
      if (isTResponseData(res)) {
        const newCart = (res as TResponseData<API.ResponseDataCart>).value.data;
        dispatch(setCart(newCart.items));

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
