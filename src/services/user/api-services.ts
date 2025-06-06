import request from "@/components/interceptor";
import API_ENDPOINTS from "@/services/user/api-path";

export const getAllUser = async ({
    search,
    status,
    roleName,
    sortBy,
    desc,
    pageIndex,
    pageSize,
}: REQUEST.GetUsers): Promise<TResponseData<API.ResponseDataUser>> => {
  const response = await request<TResponseData<API.ResponseDataUser>>(
    API_ENDPOINTS.USERS,
    {
      method: "GET",
      params: {
        search,
        status,
        roleName,
        sortBy,
        desc,
        pageIndex,
        pageSize,
      },
    }
  );
  return response.data;
};

export const changeStatusUsersByAdmin = async ({
  sellerId,
  body,
}: {
  sellerId: string;
  body: REQUEST.VerifySeller;
}): Promise<TResponseData<any>> => {
  const formData = new FormData();
  formData.append("IsApproved", String(body.IsApproved));
  formData.append("RejectReason", body.RejectReason || "");

  const response = await request<TResponseData<any>>(
    API_ENDPOINTS.CHANGE_STATUS_USERS_BY_ADMIN(sellerId),
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