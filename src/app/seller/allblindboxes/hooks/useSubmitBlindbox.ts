import { useServiceSubmitBlindbox } from "@/services/blindboxes/services";

export default function useSubmitBlindbox() {
  const { mutate, isPending } = useServiceSubmitBlindbox();

  const onSubmit  = (blindboxesId: string, onSuccessCallback?: () => void) => {
    try {
      mutate(blindboxesId, {
        onSuccess: () => {
          if (onSuccessCallback) {
            onSuccessCallback();
          }
        },
      });
    } catch (error) {
      console.error("SubmitError error:", error);
    }
  };

  return {
    onSubmit,
    isPending,
  };
}
