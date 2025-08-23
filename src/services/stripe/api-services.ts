import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/stripe/api-path";

export const createOrder = async (
  data: REQUEST.CreateOrderList
): Promise<TResponseData<API.CreateOrderData>> => {
  const response = await request.post<TResponseData<API.CreateOrderData>>(
    API_ENDPOINTS.CHECKOUT_DIRECT,
    data
  );
  return response.data;
};

export const previewShipping = async (
  data: REQUEST.CreateOrderList
): Promise<TResponseData<API.ShipmentPreview[]>> => {
  const response = await request.post<TResponseData<API.ShipmentPreview[]>>(
    API_ENDPOINTS.PREVIEW_SHIPPING_DIRECT,
    data
  );
  return response.data;
};

export const createGroupPaymentLink = async (
  data: REQUEST.CreateGroupPaymentLink
) => {
  const response = await request.post<TResponseData<any>>(
    API_ENDPOINTS.GROUP_PAYMENT_LINK,
    data
  );
  return response.data;
};

export const cancelPayment = async (data: REQUEST.CancelPayment) => {
  const response = await request.post<TResponseData<any>>(
    API_ENDPOINTS.CANCEL_PAYMENT,
    data
  );
  return response.data;
};

export const getOnboardingLink = async (): Promise<TResponseData<string>> => {
  const response = await request.get<TResponseData<string>>(
    API_ENDPOINTS.ONBOARDING_LINK
  );
  return response.data;
};

export const getLoginLink = async (): Promise<TResponseData<string>> => {
  const response = await request.get<TResponseData<string>>(
    API_ENDPOINTS.LOGIN_LINK
  );
  return response.data;
};

export const verifySellerAccount = async (
  params: REQUEST.VerifySellerAccount
): Promise<TResponseData<any>> => {
  const response = await request.get<TResponseData<any>>(
    API_ENDPOINTS.VERIFY_SELLER_ACCOUNT,
    { params }
  );
  return response.data;
};
