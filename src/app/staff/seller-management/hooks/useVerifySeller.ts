import useToast from "@/hooks/use-toast";
import { useServiceVerifySellerByStaff } from "@/services/seller/services";
import { useState } from "react";

export default function useVerifySeller() {
  const { mutateAsync } = useServiceVerifySellerByStaff();
  const { addToast } = useToast();
  const [isPending, setPending] = useState(false);

  const verifySeller = async (
    sellerId: string,
    body: REQUEST.VerifySeller
  ): Promise<boolean> => {
    setPending(true);
    
    try {
      await mutateAsync({ sellerId, body });
      return true;
    } catch (error) {
      addToast({
        type: "error",
        description: "Không thể duyệt người bán. Vui lòng thử lại.",
      });
      return false;
    } finally {
      setPending(false);
    }
  };

  return { verifySeller, isPending };
}
