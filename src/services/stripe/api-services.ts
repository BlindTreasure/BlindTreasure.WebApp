import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/stripe/api-path";

export const createOrder = async (
  data: REQUEST.CreateOrderList
): Promise<TResponseData<string>> => {
  const response = await request.post<TResponseData<string>>(
    API_ENDPOINTS.CHECKOUT_DIRECT,
    data,
  );
  return response.data;
};
