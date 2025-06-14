import { useMutation } from "@tanstack/react-query";
import { deleteCartItemByCustomer } from "@/services/cart-item/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useServiceDeleteCartItem = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<any>,
    TMeta,
    { cartItemId: string }
  >({
    mutationFn: ({ cartItemId }) => deleteCartItemByCustomer(cartItemId),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data?.value?.message || "Xóa item trong cart thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Xóa item trong cart thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};