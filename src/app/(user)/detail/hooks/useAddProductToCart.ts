import useToast from "@/hooks/use-toast";
import { addCartItemByCustomer } from "@/services/cart-item/api-services";
import { isTResponseData } from "@/utils/compare";
import { useRef, useState } from "react";
import { useAppDispatch } from "@/stores/store";
import { setCart } from "@/stores/cart-slice";

export default function useAddProductToCart() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const hasFetchedData = useRef(false);
  const dispatch = useAppDispatch();

  const addProductToCartApi = async ({
    productId,
    quantity,
  }: REQUEST.AddItemToCart) => {
    setPending(true);
    try {
      const res = await addCartItemByCustomer({ productId, quantity });

      if (isTResponseData(res)) {
        const newCart = (res as TResponseData<API.ResponseDataCart>).value.data;

        dispatch(setCart(newCart));

        addToast({
          type: "success",
          description: `Đã thêm ${quantity} sản phẩm vào giỏ hàng`,
          duration: 3000,
        });

        return res;
      } else {
        addToast({
          type: "error",
          description:
            "Không thể thêm sản phẩm vào giỏ hàng. Vui lòng thử lại!",
          duration: 4000,
        });

        return null;
      }
    } catch (error: any) {
      // ❌ Lỗi bất ngờ
      addToast({
        type: "error",
        description: "Không thể thêm vào giỏ hàng",
        duration: 5000,
      });

      console.error("Add to cart error:", error);
      return null;
    } finally {
      setPending(false);
    }
  };

  return { isPending, addProductToCartApi };
}
