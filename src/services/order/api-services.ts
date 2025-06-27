import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/order/api-path";
import { OrderResponse } from "./typings";

// export const getOrderByCustomer = async (): Promise<
//   TResponseData<OrderResponse[]>
// > => {
//   const response = await request<TResponseData<OrderResponse[]>>(
//     API_ENDPOINTS.ORDER,
//     {
//       method: "GET",
//     }
//   );
//   return response.data;
// };


export const getOrderByCustomer = async () => {
  const response = await request<TResponseData<OrderResponse[]>>(
    API_ENDPOINTS.ORDER,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getOrderDetailById = async (orderId: string) => {
  const response = await request<TResponseData<OrderResponse>>(
    API_ENDPOINTS.ORDER_WITH_ID(orderId),
    {
      method: "GET",
    }
  );
  return response.data;
};