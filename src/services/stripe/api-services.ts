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

export const previewShipping = async (
  data: REQUEST.CreateOrderList
): Promise<TResponseData<API.ShipmentPreview[]>> => {
  const response = await request.post<TResponseData<API.ShipmentPreview[]>>(
    API_ENDPOINTS.PREVIEW_SHIPPING_DIRECT,
    data,
  );
  return response.data;
};
