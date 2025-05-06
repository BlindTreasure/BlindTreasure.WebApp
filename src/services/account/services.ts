import useToast from "@/hooks/use-toast";
import { getQueryClient } from "@/lib/query";
import {
  changePassword,
  getAccountProfile,
  updateAvatarProfile,
  updateEmailProfile,
  updateInfoProfile,
  verifyChangeEmail,
  verifyChangePassword,
} from "@/services/account/api-services";
import { useAppDispatch } from "@/stores/store";
import { updateImage, updateInformationProfile } from "@/stores/user-slice";
import { useMutation } from "@tanstack/react-query";

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
      formData.append("CropAvatar", data.cropAvatar);
      formData.append("FullAvatar", data.fullAvatar);

      return await updateAvatarProfile(formData);
    },
    onSuccess: (data) => {
      dispatch(
        updateImage({
          cropAvatarLink: data.value.data.cropAvatarLink,
          fullAvatarLink: data.value.data.fullAvatarLink,
        })
      );
      addToast(
        {
          type: "success",
          description: data.value.message,
          duration: 5000,
        },
        false
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

export const useServiceUpdateEmailProfile = () => {
  const { addToast } = useToast();
  return useMutation<TResponse, TMeta, REQUEST.TUpdateEmail>({
    mutationFn: updateEmailProfile,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceVerifyChangeEmail = () => {
  const { addToast } = useToast();
  return useMutation<TResponse, TMeta, REQUEST.TVerifyChangeEmail>({
    mutationFn: verifyChangeEmail,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceChangePassword = () => {
  const { addToast } = useToast();
  return useMutation<TResponse, TMeta, REQUEST.TChangePassword>({
    mutationFn: changePassword,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      addToast({
        type: "error",
        description: error?.detail,
        duration: 3000,
      });
    },
  });
};

export const useServiceVerifyChangePassword = () => {
  const { addToast } = useToast();
  return useMutation<TResponse, TMeta, REQUEST.TVerifyChangePassword>({
    mutationFn: verifyChangePassword,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};
