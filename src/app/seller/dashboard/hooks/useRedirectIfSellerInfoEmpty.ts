import { useEffect } from "react";
import { useRouter } from "next/navigation";
import useToast from "@/hooks/use-toast";
import { useServiceGetSellerProfile } from "@/services/account/services";

export default function useRedirectIfSellerInfoEmpty() {
  const router = useRouter();
  const { addToast } = useToast();

  const {
    data,
    isLoading: isPending,
    isError,
    error,
  } = useServiceGetSellerProfile();

  console.log(data);
  
  useEffect(() => {
    if (data?.value?.data?.sellerStatus === "InfoEmpty") {
      router.push("/seller/information");
    }
  }, [data, router]);

  return {
    sellerInfo: data?.value?.data ?? null,
    isPending,
  };
}
