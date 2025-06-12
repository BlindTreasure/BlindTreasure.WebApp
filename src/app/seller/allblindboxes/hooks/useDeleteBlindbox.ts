import { useServiceDeleteBlindbox } from "@/services/blindboxes/services";

export default function useDeleteBlindbox() {
  const { mutate, isPending } = useServiceDeleteBlindbox();

  const onDeleteBlindbox = (blindboxesId: string, onSuccessCallback?: () => void) => {
    try {
      mutate(blindboxesId, {
        onSuccess: () => {
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
      });
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return {
    onDeleteBlindbox,
    isPending,
  };
}
