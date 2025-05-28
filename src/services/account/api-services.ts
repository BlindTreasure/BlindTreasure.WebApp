import request from "@/components/interceptor";
import API_ENDPOINTS from "@/services/account/api-path";

export const getAccountProfile = async () => {
  const response = await request<TResponseData<API.TProfileAccount>>(
    API_ENDPOINTS.GET_ACCOUNT_PROFILE,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const updateAvatarProfile = async (body: FormData) => {
  const response = await request<TResponseData<API.TUpdateAvatar>>(
    API_ENDPOINTS.UPDATE_AVATAR_PROFILE,
    {
      method: "PUT",
      data: body,
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
};

export const updateInfoProfile = async (body: REQUEST.TUpdateInfoProfile) => {
  const response = await request<TResponseData<API.TProfileAccount>>(
    API_ENDPOINTS.UPDATE_INFO_PROFILE,
    {
      method: "PUT",
      data: body,
    }
  );
  return response.data;
};


