"use client";
import React, { useState, useEffect } from "react";
import Badge from "../ui/badge/Badge";
import { getSellerStatisticsOrderStatus } from "@/services/seller-dashboard/api-services";
import { StatisticRange } from "@/const/seller";
import { SellerStatisticsOrderStatus } from "@/services/seller-dashboard/typings";
import { OrderStatus, OrderStatusText } from "@/const/products";

export default function OrderStatusStats() {
  const [orderStats, setOrderStats] = useState<SellerStatisticsOrderStatus[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchOrderStats = async () => {
      setIsLoading(true);
      try {
        const response = await getSellerStatisticsOrderStatus({
          range: StatisticRange.MONTH,
        });

        if (response.value?.data) {
          setOrderStats(response.value.data);
        }
      } catch (error) {
        console.error("Error fetching order stats:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrderStats();
  }, []);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusColor = (status: OrderStatus): string => {
    switch (status) {
      case OrderStatus.PENDING:
        return "bg-yellow-100 text-yellow-700";
      case OrderStatus.IN_INVENTORY:
        return "bg-blue-100 text-blue-700";
      case OrderStatus.SHIPPING_REQUESTED:
        return "bg-indigo-100 text-indigo-700";
      case OrderStatus.PARTIALLY_SHIPPING_REQUESTED:
        return "bg-purple-100 text-purple-700";
      case OrderStatus.DELIVEREDING:
        return "bg-orange-100 text-orange-700";
      case OrderStatus.PARTIALLY_DELIVERING:
        return "bg-pink-100 text-pink-700";
      case OrderStatus.DELIVERED:
        return "bg-green-100 text-green-700";
      case OrderStatus.PARTIALLY_DELIVERED:
        return "bg-teal-100 text-teal-700";
      case OrderStatus.CANCELLED:
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-900 dark:bg-gray-900">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Thống kê trạng thái đơn hàng
        </h3>
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-3 gap-4 text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Doanh thu</span>
          <span>Đơn hàng</span>
          <span>Trạng thái</span>
        </div>

        {isLoading ? (
          <div className="py-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
          </div>
        ) : orderStats.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">Chưa có đơn hàng</div>
          </div>
        ) : (
          <div className="space-y-4">
            {orderStats.map((stat) => (
              <div key={stat.status} className="grid grid-cols-3 gap-4 items-center py-3 border-b border-gray-100 dark:border-gray-800 last:border-b-0">
                <div className="text-sm font-semibold text-gray-800 dark:text-white">
                  {formatCurrency(stat.revenue)}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  {stat.count}
                </div>
                <div className="flex justify-start text-xs">
                  <span
                    className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                      stat.status
                    )}`}
                  >
                    {OrderStatusText[stat.status]}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
