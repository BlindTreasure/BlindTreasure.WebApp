import useToast from "@/hooks/use-toast";
import { getQueryClient } from "@/lib/query";
import {
  getAccountProfile,
  updateAvatarProfile,
  updateInfoProfile,
} from "@/services/account/api-services";
import { useAppDispatch } from "@/stores/store";
import { updateInformationProfile } from "@/stores/user-slice";
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

