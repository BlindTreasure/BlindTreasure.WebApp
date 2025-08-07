import useToast from "@/hooks/use-toast";
import { getQueryClient } from "@/lib/query";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { handleError } from "@/hooks/error";
import { ReviewCreateRequest, ReviewResponse } from "./typings";
import { createReview, deleteReview } from "./api-services";

export const useServiceCreateReview = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<ReviewResponse>, Error, ReviewCreateRequest>({
    mutationFn: createReview,
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

export const useServiceDeleteReview = () => {
  const { addToast } = useToast();

  return useMutation<TResponse, Error, string>({
    mutationFn: deleteReview,
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
