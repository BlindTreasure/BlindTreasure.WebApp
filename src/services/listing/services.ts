import { useMutation } from "@tanstack/react-query";
import { createListing, closeListing } from "@/services/listing/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";
import {REQUEST,API} from "@/services/listing/typings"

export const useServiceCreateListing = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ListingCreated>, TMeta, REQUEST.CreateListing>({
    mutationFn: createListing,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Tạo listing thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Tạo listing thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};

export const useServiceCloseListing = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ListingItem>, TMeta, string>({
    mutationFn: closeListing,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message || "Đóng listing thành công!",
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
      addToast({
        type: "error",
        description: "Đóng listing thất bại. Vui lòng thử lại!",
        duration: 5000,
      });
    },
  });
};