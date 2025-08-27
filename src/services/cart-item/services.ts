import { useMutation } from "@tanstack/react-query";
import { deleteCartItemByCustomer } from "@/services/cart-item/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useServiceDeleteCartItem = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<API.ResponseDataCart>,
    Error,
    { cartItemId: string }
  >({
    mutationFn: ({ cartItemId }) => deleteCartItemByCustomer(cartItemId),
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data?.value?.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};