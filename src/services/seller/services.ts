import { uploadSellerDocument } from "@/services/seller/api-services";
import { useMutation } from "@tanstack/react-query";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";
import { verifySellerByStaff } from "@/services/seller/api-services";

export const useServiceUploadSellerDocument = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<any>, TMeta, FormData>({
    mutationFn: uploadSellerDocument,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data?.value?.message || "Tải tài liệu thành công!",
        duration: 5000,
      });
    },
    onError: (error: TMeta) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Tải tài liệu thất bại. Vui lòng thử lại.",
        duration: 5000,
      });
    },
  });
};

export const useServiceVerifySellerByStaff = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<any>,
    TMeta,
    { sellerId: string | number; body: REQUEST.VerifySeller }
  >({
    mutationFn: verifySellerByStaff,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data?.value?.message || "Duyệt seller thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Duyệt seller thất bại. Vui lòng thử lại.",
        duration: 5000,
      });
    },
  });
};