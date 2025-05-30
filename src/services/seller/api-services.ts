
import request from "@/components/interceptor";
import API_ENDPOINTS from "@/services/seller/api-path";

export const getAllStatusSeller = async ({
  status,
  pageIndex,
  pageSize,
}: REQUEST.GetSellers): Promise<TResponseData<API.ResponseDataSeller>> => {
  const response = await request<TResponseData<API.ResponseDataSeller>>(
    API_ENDPOINTS.SELLER,
    {
      method: "GET",
      params: {
        status,
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const uploadSellerDocument = async (formData: FormData): Promise<TResponseData<any>> => {
  const response = await request<TResponseData<any>>(API_ENDPOINTS.SELLER_UPLOAD_DOCUMENT, {
    method: "POST",
    data: formData,
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
};