import {
  uploadSellerDocument,
  getSellerById,
} from "@/services/seller/api-services";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";
import { verifySellerByStaff } from "@/services/seller/api-services";

export const useServiceUploadSellerDocument = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<any>, Error, FormData>({
    mutationFn: uploadSellerDocument,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data?.value?.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceVerifySellerByStaff = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponse,
    Error,
    { sellerId: string | number; body: REQUEST.VerifySeller }
  >({
    mutationFn: verifySellerByStaff,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data?.value?.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

