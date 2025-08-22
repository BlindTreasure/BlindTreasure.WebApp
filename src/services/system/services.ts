import { useMutation } from "@tanstack/react-query";
import { getOrderByAdmin } from "./api-services";
import { CompletedParams } from "./typings";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";

export const useAdminCompleteShipment = () => {
  const { addToast } = useToast();
  return useMutation<any, any, CompletedParams>({
    mutationFn: getOrderByAdmin,
    onSuccess: () => {
      addToast({
        type: "success",
        description: "Xác nhận hoàn thành đơn giao hàng thành công!",
        duration: 4000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Xác nhận hoàn thành thất bại!",
        duration: 4000,
      });
    },
  });
};
