 import { useMutation } from "@tanstack/react-query";
import { addWishlist, deleteWishlist } from "./api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";
import { RequestAddFavourite, WishlistItem } from "./typings";

export const useServiceAddWishlist = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<WishlistItem>, Error, RequestAddFavourite>({
    mutationFn: addWishlist,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};

export const useServiceDeleteWishlist = () => {
  const { addToast } = useToast();

  return useMutation<TResponse, Error, string>({
    mutationFn: deleteWishlist,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: (error) => {
      handleError(error);
    },
  });
};
