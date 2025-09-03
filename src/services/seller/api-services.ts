import request from "@/services/interceptor";
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

export const uploadSellerDocument = async (
  formData: FormData
): Promise<TResponseData<any>> => {
  const response = await request<TResponseData<any>>(
    API_ENDPOINTS.SELLER_UPLOAD_DOCUMENT,
    {
      method: "POST",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const verifySellerByStaff = async ({
  sellerId,
  body,
}: {
  sellerId: string | number;
  body: REQUEST.VerifySeller;
}): Promise<TResponseData<any>> => {
  const formData = new FormData();
  formData.append("IsApproved", String(body.IsApproved)); // Phải convert thành string
  formData.append("RejectReason", body.RejectReason || "");

  const response = await request<TResponseData<any>>(
    API_ENDPOINTS.VERIFY_SELLER_BY_STAFF(sellerId),
    {
      method: "PUT",
      data: formData,
      headers: {
        "Content-Type": "multipart/form-data", // Rất quan trọng
      },
    }
  );

  return response.data;
};

export const getSellerById = async (
  sellerId: string
): Promise<TResponseData<API.SellerById>> => {
  const response = await request<TResponseData<API.SellerById>>(
    API_ENDPOINTS.SELLER_BY_ID(sellerId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getSellerOverview = async (
  sellerId: string
): Promise<TResponseData<API.SellerInfo>> => {
  const response = await request<TResponseData<API.SellerInfo>>(
    API_ENDPOINTS.OVERVIEW(sellerId),
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getUserSeller = async () => {
  const response = await request<TResponseData<API.UserItem[]>>(
    API_ENDPOINTS.USERS,
    { method: "GET" }
  );
  return response.data; 
};
