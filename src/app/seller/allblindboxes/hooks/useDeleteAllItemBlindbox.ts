import { useServiceDeleteAllItemBlindbox } from "@/services/blindboxes/services";

export default function useDeleteAllItemsBlindbox() {
  const { mutate, isPending } = useServiceDeleteAllItemBlindbox();

  const onDeleteAllItem = (blindboxesId: string, onSuccessCallback?: () => void) => {
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
    onDeleteAllItem,
    isPending,
  };
}
