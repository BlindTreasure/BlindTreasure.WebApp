import useToast from "@/hooks/use-toast";
import { getQueryClient } from "@/lib/query";
import { useMutation, useQuery, UseQueryOptions } from "@tanstack/react-query";
import { handleError } from "@/hooks/error";
import { AdminStatistics, CustomerSummary, OrderSummary, RevenueSummary, SellerSummary, TimeSeries, TopCategory } from "./typings";
import { customerSummary, orderSummary, revenueSummary, sellerSummary, timeSeries, topCategories } from "./api-services";

export const useServiceRevenueSummary = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<RevenueSummary>,
    Error,
    AdminStatistics
  >({
    mutationFn: async (data: AdminStatistics) => {
      return await revenueSummary(data);
    },
    onSuccess: (data) => {
    },
  });
};

export const useServiceOrderSummary = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<OrderSummary>,
    Error,
    AdminStatistics
  >({
    mutationFn: async (data: AdminStatistics) => {
      return await orderSummary(data);
    },
    onSuccess: (data) => {
    },
  });
};

export const useServiceSellerSummary = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<SellerSummary>,
    Error,
    AdminStatistics
  >({
    mutationFn: async (data: AdminStatistics) => {
      return await sellerSummary(data);
    },
    onSuccess: (data) => {
    },
  });
};

export const useServiceCustomerSummary = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<CustomerSummary>,
    Error,
    AdminStatistics
  >({
    mutationFn: async (data: AdminStatistics) => {
      return await customerSummary(data);
    },
    onSuccess: (data) => {
    },
  });
};

export const useServiceTopCategories = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<TopCategory>,
    Error,
    AdminStatistics
  >({
    mutationFn: async (data: AdminStatistics) => {
      return await topCategories(data);
    },
    onSuccess: (data) => {
    },
  });
};

export const useServiceTimeSeries = () => {
  const { addToast } = useToast();

  return useMutation<
    TResponseData<TimeSeries>,
    Error,
    AdminStatistics
  >({
    mutationFn: async (data: AdminStatistics) => {
      return await timeSeries(data);
    },
    onSuccess: (data) => {
    },
  });
};