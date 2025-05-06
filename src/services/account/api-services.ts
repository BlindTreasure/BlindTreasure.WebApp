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

export const updateEmailProfile = async (body: REQUEST.TUpdateEmail) => {
  const response = await request<TResponse>(
    API_ENDPOINTS.UPDATE_EMAIL_PROFILE,
    {
      method: "PUT",
      data: body,
    }
  );
  return response.data;
};

export const verifyChangeEmail = async ({
  userId,
}: REQUEST.TVerifyChangeEmail) => {
  const response = await request<TResponse>(API_ENDPOINTS.VERIFY_UPDATE_EMAIL, {
    method: "PUT",
    params: {
      userId: userId,
    },
  });
  return response.data;
};

export const changePassword = async (body: REQUEST.TChangePassword) => {
  const response = await request<TResponse>(API_ENDPOINTS.CHANGE_PASSWORD, {
    method: "PUT",
    data: body,
  });
  return response.data;
};

export const verifyChangePassword = async ({
  userId,
}: REQUEST.TVerifyChangePassword) => {
  const response = await request<TResponse>(
    API_ENDPOINTS.VERIFY_CHANGE_PASSWORD,
    {
      method: "PUT",
      params: {
        userId: userId,
      },
    }
  );
  return response.data;
};
