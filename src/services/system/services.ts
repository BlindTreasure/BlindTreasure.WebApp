import { useMutation } from "@tanstack/react-query";
import { getOrderByAdmin, itemInventoryArchived } from "./api-services";
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

export const useInventoryItemArchived = (options?: { onSuccess?: () => void }) => {
  const { addToast } = useToast();
  return useMutation<any, any, any>({
    mutationFn: itemInventoryArchived,
    onSuccess: (data) => {
      const msg =
        (data as any)?.value?.message ||
        (data as any)?.message ||
        "Thao tác thành công";

      addToast({
        type: "success",
        description: msg,
        duration: 4000,
      });
      options?.onSuccess?.();
    },
    onError: (error) => {
      handleError(error);
    },
  });
};
