import useToast from "@/hooks/use-toast";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { calculateUpcoming, processPayout, requestPayout } from "./api-services";
import { handleError } from "@/hooks/error";
import { SellerPayoutSummary } from "./typings";

export const useServiceRequestPayout = () => {
  const { addToast } = useToast();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: requestPayout,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
      queryClient.invalidateQueries({ queryKey: ["calculate-upcoming"] });
    },
    onError: handleError,
  });
};
export const useServiceCalculateUpcoming = () => {
  return useQuery<TResponseData<SellerPayoutSummary>, Error>({
    queryKey: ["calculate-upcoming"],
    queryFn: calculateUpcoming,
  });
};

export const useServiceProcessPayout = () => {
  const { addToast } = useToast();

  return useMutation({
    mutationFn: processPayout,
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
    onError: handleError,
  });
};