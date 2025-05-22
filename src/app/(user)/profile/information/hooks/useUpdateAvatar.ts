import { useServiceUpdateAvatarProfile } from "@/services/account/services";

export default function useUpdateAvatar() {
  const { mutate, isPending } = useServiceUpdateAvatarProfile();

  const onSubmit = (data: REQUEST.TUpdateAvatar, clearImages: () => void) => {
    try {
      mutate(data, {
        onSuccess: () => {
          clearImages();
        },
      });
    } catch (err) {
      console.log(err);
    }
  };

  return { onSubmit, isPending };
}
