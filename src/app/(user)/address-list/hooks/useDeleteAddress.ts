import { handleError } from "@/hooks/error";
import { useServiceDeleteAddress } from "@/services/account/services";

export default function useDeleteAddress() {
  const { mutate, isPending } = useServiceDeleteAddress();

  const onDelete = (addressId: string, onSuccessCallback?: () => void) => {
    try {
      mutate(addressId, {
        onSuccess: () => {
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
      });
    } catch (error) {
        handleError(error);
    }
  };

  return {
    onDelete,
    isPending,
  };
}
