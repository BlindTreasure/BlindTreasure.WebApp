import useToast from "@/hooks/use-toast";
import { getQueryClient } from "@/lib/query";
import {
  createAddress,
  deleteAddress,
  getAccountProfile,
  setDefaultAddress,
  updateAddress,
  updateAvatarProfile,
  updateInfoProfile,
} from "@/services/account/api-services";
import { useAppDispatch } from "@/stores/store";
import { updateImage, updateInformationProfile } from "@/stores/user-slice";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { getSellerProfile, updateSellerProfile } from "@/services/account/api-services";
import { handleError } from "@/hooks/error";

export const useServiceGetProfileAccount = async () => {
  const queryClient = getQueryClient();
  return await queryClient.fetchQuery<
    TResponseData<API.TProfileAccount>,
    TMeta
  >({
    queryKey: ["authentication"],
    queryFn: async () => await getAccountProfile(),
  });
};

export const useServiceUpdateAvatarProfile = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  return useMutation<
    TResponseData<API.TUpdateAvatar>,
    TMeta,
    REQUEST.TUpdateAvatar
  >({
    mutationFn: async (data: REQUEST.TUpdateAvatar) => {
      const formData = new FormData();
      formData.append("File", data.file);
      return await updateAvatarProfile(formData);
    },
    onSuccess: (data) => {
      dispatch(
        updateImage({
          avatarUrl: data.value.data.avatarUrl,
        })
      );
      addToast(
        {
          type: "success",
          description: data.value.message,
          duration: 5000,
        },
      );
    },
    onError: () => {
      addToast({
        type: "error",
        description: "Please try again!",
        duration: 5000,
      });
    },
  });
};

export const useServiceUpdateInfoProfile = () => {
  const dispatch = useAppDispatch();
  const { addToast } = useToast();
  return useMutation<
    TResponseData<API.TProfileAccount>,
    TMeta,
    REQUEST.TUpdateInfoProfile
  >({
    mutationFn: updateInfoProfile,
    onSuccess: (data) => {
      dispatch(updateInformationProfile(data.value.data));
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceGetSellerProfile = () => {
  const { addToast } = useToast();

  return useQuery<TResponseData<API.Seller>, TMeta>({
    queryKey: ["seller", "profile"],
    queryFn: getSellerProfile,
    retry: false,
    onError: (error: TMeta) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Không thể lấy thông tin người bán.",
        duration: 5000,
      });
    },
  } as UseQueryOptions<TResponseData<API.Seller>, TMeta>);
};

// Cập nhật thông tin seller
export const useServiceUpdateSellerProfile = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.Seller>, TMeta, REQUEST.UpdateSellerInfo>({
    mutationFn: updateSellerProfile,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Cập nhật thông tin thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Cập nhật thất bại. Vui lòng thử lại.",
        duration: 5000,
      });
    },
  });
};

export const useServiceAddress = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ResponseAddress>, Error, REQUEST.TCreateAddress>({
    mutationFn: async (data: REQUEST.TCreateAddress) => {
      return await createAddress(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServicesUpdateAddress = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<API.ResponseAddress>,
    Error,
    REQUEST.TUpdateAddress & { addressId: string }
  >({
    mutationFn: updateAddress,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceSetDefaultAddress = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ResponseAddress>, Error, string>({
    mutationFn: async (addressId: string) => {
      return await setDefaultAddress(addressId);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceDeleteAddress = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ResponseAddress>, Error, string>({
    mutationFn: async (addressId: string) => {
      return await deleteAddress(addressId);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};