import request from "@/services/interceptor";
import API_ENDPOINTS from "@/services/account/api-path";
import { getStorageItem } from "@/utils/local-storage";

export const getAccountProfile = async () => {
  const response = await request<TResponseData<API.TProfileAccount>>(
    API_ENDPOINTS.GET_ACCOUNT_PROFILE,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getAddresses = async () => {
  const response = await request<TResponseData<API.ResponseAddress[]>>(
    API_ENDPOINTS.GET_ADDRESSES,
    {
      method: "GET",
    }
  );
  return response.data;
};

export const getAddressById = async (addressId: string) => {
  const response = await request<TResponseData<API.ResponseAddress>>(
    API_ENDPOINTS.ADDRESS_BY_ID(addressId),
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

// Lấy thông tin seller hiện tại
export const getSellerProfile = async () => {
  const response = await request<TResponseData<API.Seller>>(
    API_ENDPOINTS.GET_ACCOUNT_SELLER_PROFILE,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStorageItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

// Cập nhật thông tin seller
export const updateSellerProfile = async (body: REQUEST.UpdateSellerInfo) => {
  const response = await request<TResponseData<API.Seller>>(
    API_ENDPOINTS.UPDATE_INFO_SELLER_PROFILE,
    {
      method: "PUT",
      data: body,
      headers: {
        Authorization: `Bearer ${getStorageItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

export const createAddress = async (
  body: REQUEST.TCreateAddress
): Promise<TResponseData<API.ResponseAddress>> => {
  const response = await request<TResponseData<API.ResponseAddress>>(
    API_ENDPOINTS.ADD_ADDRESS,
    {
      method: "POST",
      data: body,
    }
  );

  return response.data;
};

export const setDefaultAddress = async (
  addressId: string
): Promise<TResponseData<API.ResponseAddress>> => {
  const response = await request<TResponseData<API.ResponseAddress>>(
    API_ENDPOINTS.SET_DEFAULT_ADDRESS(addressId),
    {
      method: "PUT",
    }
  );

  return response.data;
};

export const deleteAddress = async (
  addressId: string
): Promise<TResponseData<API.ResponseAddress>> => {
  const response = await request<TResponseData<API.ResponseAddress>>(
    API_ENDPOINTS.ADDRESS_BY_ID(addressId),
    {
      method: "DELETE",
    }
  );

  return response.data;
};

export const updateAddress = async (
  body: REQUEST.TUpdateAddress & { addressId: string }
): Promise<TResponseData<API.ResponseAddress>> => {
  const { addressId, ...data } = body;

  const response = await request<TResponseData<API.ResponseAddress>>(
    API_ENDPOINTS.ADDRESS_BY_ID(addressId),
    {
      method: "PUT",
      data,
    }
  );

  return response.data;
};

export const updateProfileSeller = async (body: REQUEST.UpdateSellerInfo) => {
  const response = await request<TResponseData<API.TUpdateSellerProfile>>(
    API_ENDPOINTS.UPDATE_INFO_SELLER_PROFILE,
    {
      method: "PUT",
      data: body,
      headers: {
        Authorization: `Bearer ${getStorageItem("accessToken")}`,
      },
    }
  );
  return response.data;
};

export const updateAvatarSeller = async (body: FormData) => {
  const response = await request<TResponseData<string>>(
    API_ENDPOINTS.UPDATE_AVATAR_SELLER,
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

export const getProfileSeller = async () => {
  const response = await request<TResponseData<API.TResponeSeller>>(
    API_ENDPOINTS.GET_ACCOUNT_SELLER_PROFILE,
    {
      method: "GET",
      headers: {
        Authorization: `Bearer ${getStorageItem("accessToken")}`,
      },
    }
  );
  return response.data;
};