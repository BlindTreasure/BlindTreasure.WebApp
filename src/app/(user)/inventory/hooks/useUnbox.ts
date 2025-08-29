import { useState } from "react";
import { useRouter } from "next/navigation";
import { useServiceUnBoxSilent } from "@/services/unbox/services";
import { UnboxResult } from "@/services/unbox/typings";

export default function useUnbox() {
  const router = useRouter();
  const [isUnboxing, setIsUnboxing] = useState(false);
  const { mutate, isPending } = useServiceUnBoxSilent();

  const handleUnbox = async (
    customerBlindBoxId: string,
    blindBoxName?: string,
    blindBoxId?: string
  ) => {
    setIsUnboxing(true);

    try {
      mutate(customerBlindBoxId, {
        onSuccess: (response) => {
          const unboxResult: UnboxResult = response.value.data;

          const searchParams = new URLSearchParams({
            productId: unboxResult.productId,
            unboxedAt: unboxResult.unboxedAt,
            blindBoxName: blindBoxName || "BlindBox",
            ...(blindBoxId && { blindBoxId }),
          });

          router.push(`/open-result?${searchParams.toString()}`);
        },
        onError: (error) => {
          setIsUnboxing(false);
        },
        onSettled: () => {
          setIsUnboxing(false);
        },
      });
    } catch (error) {
      setIsUnboxing(false);
    }
  };

  return {
    handleUnbox,
    isUnboxing: isUnboxing || isPending,
  };
}
