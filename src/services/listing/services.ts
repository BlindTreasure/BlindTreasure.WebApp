import { useMutation } from "@tanstack/react-query";
import { createListing, closeListing } from "@/services/listing/api-services";
import useToast from "@/hooks/use-toast";
import { handleError } from "@/hooks/error";
import {REQUEST,API} from "@/services/listing/typings"

export const useServiceCreateListing = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ListingCreated>, Error, REQUEST.CreateListing>({
    mutationFn: createListing,
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

export const useServiceCloseListing = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<API.ListingItem>, Error, string>({
    mutationFn: closeListing,
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