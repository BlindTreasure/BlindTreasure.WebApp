import useToast from "@/hooks/use-toast";
import { deleteAllCartItemByCustomer } from "@/services/cart-item/api-services";
import { isTResponseData } from "@/utils/compare";
import { useCallback, useState } from "react";
import { useAppDispatch } from "@/stores/store";
import { clearCart } from "@/stores/cart-slice";

export default function useClearAllCartItem() {
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);
  const dispatch = useAppDispatch();

  const clearAllCartItemApi = useCallback(async () => {
    setPending(true);
    try {
      const res = await deleteAllCartItemByCustomer();
      if (isTResponseData(res)) {
        dispatch(clearCart());
        addToast({
        type: "success",
        description: res.value.message || "Xóa item trong cart thành công!",
        duration: 5000,
      });
        return res as TResponseData<API.ResponseDataCart>;
      } else {
        addToast({
          type: "error",
          description: "Xóa item trong cart thất bại. Vui lòng thử lại!",
        });
        return null;
      }
    } catch (error) {
      addToast({
        type: "error",
        description: "Đã xảy ra lỗi khi xóa item trong cart.",
      });
      return null;
    } finally {
      setPending(false);
    }
  }, [addToast]);

  return { isPending, clearAllCartItemApi };
}
