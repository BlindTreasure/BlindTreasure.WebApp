import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/stripe/api-path";

export const createOrder = async (
  data: REQUEST.CreateOrderList
): Promise<TResponseData<API.CreateOrderData>> => {
  const response = await request.post<TResponseData<API.CreateOrderData>>(
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
