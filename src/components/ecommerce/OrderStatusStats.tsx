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

  const getStatusColor = (status: OrderStatus): 'success' | 'warning' | 'error' | 'info' => {
    switch (status) {
      case OrderStatus.DELIVERED:
        return 'success';
      case OrderStatus.PENDING:
        return 'warning';
      case OrderStatus.CANCELLED:
        return 'error';
      case OrderStatus.DELIVEREDING:
      case OrderStatus.PARTIALLY_DELIVERING:
        return 'info';
      default:
        return 'info';
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
            <div className="text-gray-500 dark:text-gray-400">Không có dữ liệu</div>
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
                  <Badge
                    size="sm"
                    color={getStatusColor(stat.status)}
                  >
                    {OrderStatusText[stat.status]}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
