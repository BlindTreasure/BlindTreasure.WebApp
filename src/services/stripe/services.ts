import useToast from "@/hooks/use-toast";
import { createOrder, previewShipping } from "./api-services";
import { useMutation } from "@tanstack/react-query";
import { handleError } from "@/hooks/error";

export const OrderService = {
  createOrder: async (data: REQUEST.CreateOrderList): Promise<string> => {
    try {
      const response = await createOrder(data);
      if (response.isSuccess) {
        return response.value.data; 
      } else {
        throw new Error(response.error.message || "Tạo đơn hàng thất bại");
      }
    } catch (error) {
      console.error("Error creating order:", error);
      throw error;
    }
  },
};

export const useServicePreviewShipping = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<API.ShipmentPreview[]>,
    Error,
    REQUEST.CreateOrderList
  >({
    mutationFn: async (data: REQUEST.CreateOrderList) => {
      return await previewShipping(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};