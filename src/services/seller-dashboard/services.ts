import useToast from "@/hooks/use-toast";
import { getQueryClient } from "@/lib/query";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { handleError } from "@/hooks/error";
import { getSellerStatistics, getSellerStatisticsById, getSellerStatisticsOrderStatus, getSellerStatisticsOverview, getSellerStatisticsTimeSeries, getSellerStatisticsTopBlindBoxes, getSellerStatisticsTopProducts } from "./api-services";
import { SellerStatistics, SellerStatisticsOrderStatus, SellerStatisticsOverview, SellerStatisticsResponse, SellerStatisticsTimeSeries, SellerStatisticsTopBlindboxes, SellerStatisticsTopProduct } from "./typings";

export const useServiceGetSellerStatistics = () => {
  const { addToast } = useToast();

  return useMutation<
    SellerStatisticsResponse,
    Error,
    SellerStatistics
  >({
    mutationFn: async (data: SellerStatistics) => {
      return await getSellerStatistics(data);
    },
    onSuccess: (data) => {
    },
  });
};

export const useServiceGetSellerStatisticsById = (sellerId: string) => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<SellerStatisticsResponse>,
    Error,
    SellerStatistics
  >({
    mutationFn: async (data: SellerStatistics) => {
      return await getSellerStatisticsById(sellerId, data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceGetSellerStatisticsOverview = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<SellerStatisticsOverview>,
    Error,
    SellerStatistics
  >({
    mutationFn: async (data: SellerStatistics) => {
      return await getSellerStatisticsOverview(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceGetSellerStatisticsTopProducts = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<SellerStatisticsTopProduct[]>,
    Error,
    SellerStatistics
  >({
    mutationFn: async (data: SellerStatistics) => {
      return await getSellerStatisticsTopProducts(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceGetSellerStatisticsTopBlindBoxes = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<SellerStatisticsTopBlindboxes[]>,
    Error,
    SellerStatistics
  >({
    mutationFn: async (data: SellerStatistics) => {
      return await getSellerStatisticsTopBlindBoxes(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceGetSellerStatisticsOrderStatus = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<SellerStatisticsOrderStatus[]>,
    Error,
    SellerStatistics
  >({
    mutationFn: async (data: SellerStatistics) => {
      return await getSellerStatisticsOrderStatus(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};

export const useServiceGetSellerStatisticsTimeSeries = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<SellerStatisticsTimeSeries>,
    Error,
    SellerStatistics
  >({
    mutationFn: async (data: SellerStatistics) => {
      return await getSellerStatisticsTimeSeries(data);
    },
    onSuccess: (data) => {
      addToast({
        type: "success",
        description: data.value.message,
        duration: 5000,
      });
    },
  });
};
