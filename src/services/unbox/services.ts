import useToast from "@/hooks/use-toast";
import { useMutation } from "@tanstack/react-query";
import { UnboxResult } from "./typings";
import { unbox } from "./api-services";
import { handleError } from "@/hooks/error";

export const useServiceUnBox = () => {
  const { addToast } = useToast();

  return useMutation<TResponseData<UnboxResult>, Error, string>({
    mutationFn: unbox,
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
export const useServiceUnBoxSilent = () => {
  return useMutation<TResponseData<UnboxResult>, Error, string>({
    mutationFn: unbox,
    onError: (error) => {
      handleError(error);
    },
  });
};
