import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/order/api-path";

export const getCartByCustomer = async (): Promise<
  TResponseData<API.ResponseDataCart>
> => {
  const response = await request<TResponseData<API.ResponseDataCart>>(
    API_ENDPOINTS.ORDER,
    {
      method: "GET",
    }
  );
  return response.data;
};