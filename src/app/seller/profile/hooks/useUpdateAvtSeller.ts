import { useServiceUpdateAvatarSeller } from "@/services/account/services";
import { getQueryClient } from "@/lib/query";
import { getAccountProfile } from "@/services/account/api-services";
import { useAppDispatch, useAppSelector } from "@/stores/store";
import { setUser } from "@/stores/user-slice";

export default function useUpdateAvatarSeller() {
  const { mutate, isPending } = useServiceUpdateAvatarSeller();
  const queryClient = getQueryClient();
  const dispatch = useAppDispatch();
  const userState = useAppSelector((state) => state.userSlice);

  const onSubmit = (
    data: REQUEST.UpdateSellerAvatar,
    clearImages: () => void
  ) => {
    try {
      mutate(data, {
        onSuccess: async (response) => {
          clearImages();
          const newAvatarUrl = response?.value?.data;
          queryClient.invalidateQueries({ queryKey: ["seller", "profile"] });
          if (newAvatarUrl) {
            if (!userState.user) {
              try {
                const profileRes = await getAccountProfile();
                const profile = profileRes?.value?.data;
                if (profile) {
                  dispatch(
                    setUser({
                      ...profile,
                      avatarUrl: newAvatarUrl, 
                    })
                  );
                }
              } catch (error) {
                console.error("Failed to refetch user profile:", error);
              }
            } else {
              dispatch(
                setUser({
                  ...userState.user,
                  avatarUrl: newAvatarUrl,
                })
              );
            }
          } else {
            try {
              const profileRes = await getAccountProfile();
              const profile = profileRes?.value?.data;

              if (profile) {
                if (!userState.user) {
                  dispatch(setUser(profile));
                } else {
                  dispatch(
                    setUser({
                      ...userState.user,
                      avatarUrl: profile.avatarUrl,
                    })
                  );
                }
              }
            } catch (error) {
              console.error("Failed to refetch user profile:", error);
            }
          }
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return { onSubmit, isPending };
}
