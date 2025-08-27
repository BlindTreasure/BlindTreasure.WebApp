"use client";
import React, { useEffect, useState, useRef } from "react";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon, BoxIconLine, GroupIcon } from "@/icons/index";
import { DollarSign, TrendingUp, HandCoins } from "lucide-react";
import { getSellerStatisticsOverview } from "@/services/seller-dashboard/api-services";
import { StatisticRange } from "@/const/seller";
import { SellerStatisticsOverview } from "@/services/seller-dashboard/typings";
import { TbShoppingCartCheck } from "react-icons/tb";

export const EcommerceMetrics = () => {
  const [overviewData, setOverviewData] = useState<SellerStatisticsOverview | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasCalledApiRef = useRef(false);

  useEffect(() => {
    if (hasCalledApiRef.current) return;

    const fetchOverviewData = async () => {
      hasCalledApiRef.current = true;
      setIsLoading(true);

      try {
        const response = await getSellerStatisticsOverview({
          range: StatisticRange.MONTH,
        });

        if (response.value?.data) {
          setOverviewData(response.value.data);
        }
      } catch (error) {
        console.error("Error fetching overview data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOverviewData();
  }, []);

  // const formatNumber = (num: number) => {
  //   if (num >= 1000000) {
  //     return `${(num / 1000000).toFixed(1)}M`;
  //   } else if (num >= 1000) {
  //     return `${(num / 1000).toFixed(1)}K`;
  //   }
  //   return num.toLocaleString();
  // };

  const formatNumber = (num: number) => {
    if (num == null || isNaN(num)) return "0";
    return new Intl.NumberFormat("vi-VN").format(num);
  };

  const formatGrowthPercent = (percent: number) => {
    return Math.abs(percent).toFixed(2);
  };

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 md:gap-6">
      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-900 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <DollarSign className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Doanh thu thực tế
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-2xl">
              {isLoading ? "..." : overviewData ? `${formatNumber(overviewData.actualRevenue)} ₫` : "0 ₫"}
            </h4>
          </div>
          {overviewData && (
            <Badge color={overviewData.actualRevenueGrowthPercent >= 0 ? "success" : "error"}>
              {overviewData.actualRevenueGrowthPercent >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {formatGrowthPercent(overviewData.actualRevenueGrowthPercent)}%
            </Badge>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-900 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <HandCoins className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Doanh thu ước tính
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-2xl">
              {isLoading ? "..." : overviewData ? `${formatNumber(overviewData.estimatedRevenue)} ₫` : "0 ₫"}
            </h4>
          </div>
          {overviewData && (
            <Badge color={overviewData.estimatedRevenueGrowthPercent >= 0 ? "success" : "error"}>
              {overviewData.estimatedRevenueGrowthPercent >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {formatGrowthPercent(overviewData.estimatedRevenueGrowthPercent)}%
            </Badge>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <TbShoppingCartCheck className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số sản phẩm đã bán
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-2xl">
              {isLoading ? "..." : overviewData ? formatNumber(overviewData.totalProductsSold) : "0"}
            </h4>
          </div>
          {overviewData && (
            <Badge color={overviewData.productsSoldGrowthPercent >= 0 ? "success" : "error"}>
              {overviewData.productsSoldGrowthPercent >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {formatGrowthPercent(overviewData.productsSoldGrowthPercent)}%
            </Badge>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <BoxIconLine className="text-gray-800 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Tổng số đơn hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-2xl">
              {isLoading ? "..." : overviewData ? formatNumber(overviewData.totalOrders) : "0"}
            </h4>
          </div>

          {overviewData && (
            <Badge color={overviewData.ordersGrowthPercent >= 0 ? "success" : "error"}>
              {overviewData.ordersGrowthPercent >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {formatGrowthPercent(overviewData.ordersGrowthPercent)}%
            </Badge>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6">
        <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
          <TrendingUp className="text-gray-800 size-6 dark:text-white/90" />
        </div>
        <div className="flex items-end justify-between mt-5">
          <div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              Giá trị trung bình mỗi đơn hàng
            </span>
            <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-2xl">
              {isLoading ? "..." : overviewData ? `${formatNumber(overviewData.averageOrderValue)} ₫` : "0 ₫"}
            </h4>
          </div>

          {overviewData && (
            <Badge color={overviewData.averageOrderValueGrowthPercent >= 0 ? "success" : "error"}>
              {overviewData.averageOrderValueGrowthPercent >= 0 ? <ArrowUpIcon /> : <ArrowDownIcon />}
              {formatGrowthPercent(overviewData.averageOrderValueGrowthPercent)}%
            </Badge>
          )}
        </div>
      </div>
    </div>
  );
};

