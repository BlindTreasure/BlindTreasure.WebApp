import { createOrder } from "./api-services";

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