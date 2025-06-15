import { handleError } from "@/hooks/error";
import { useServiceSetDefaultAddress } from "@/services/account/services";

export default function useSetDefaultAddress() {
  const { mutate, isPending } = useServiceSetDefaultAddress();

  const onSetDefault = (addressId: string, onSuccessCallback?: () => void) => {
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
    onSetDefault,
    isPending,
  };
}
