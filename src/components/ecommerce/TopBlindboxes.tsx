"use client";
import React, { useState, useEffect } from "react";
import { getSellerStatisticsTopBlindBoxes } from "@/services/seller-dashboard/api-services";
import { StatisticRange } from "@/const/seller";
import { SellerStatisticsTopBlindboxes } from "@/services/seller-dashboard/typings";

export default function TopBlindboxes() {
  const [topBlindboxes, setTopBlindboxes] = useState<SellerStatisticsTopBlindboxes[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchTopBlindboxes = async () => {
      setIsLoading(true);
      try {
        const response = await getSellerStatisticsTopBlindBoxes({
          range: StatisticRange.MONTH,
        });

        if (response.value?.data) {
          setTopBlindboxes(response.value.data);
        }
      } catch (error) {
        console.error("Error fetching top products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchTopBlindboxes();
  }, []);

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  return (
    <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white px-6 py-6 dark:border-gray-900 dark:bg-gray-900">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
          Top Blindboxes bán chạy
        </h3>
      </div>

      <div className="mb-4">
        <div className="flex justify-between text-sm text-gray-500 dark:text-gray-400 mb-4">
          <span>Blindbox</span>
          <span>Doanh thu</span>
        </div>
      </div>

      <div className="space-y-4">
        {isLoading ? (
          <div className="py-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
          </div>
        ) : topBlindboxes.length === 0 ? (
          <div className="py-8 text-center">
            <div className="text-gray-500 dark:text-gray-400">Chưa có xếp hạng cho blindbox</div>
          </div>
        ) : (
          topBlindboxes.slice(0, 5).map((blindbox, index) => (
            <div key={blindbox.blindBoxId} className="flex items-center justify-between py-2">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500 dark:text-gray-400 w-6">
                  {index + 1}
                </span>
                <img
                  src={blindbox.blindBoxImageUrl}
                  alt={blindbox.blindBoxName}
                  className="w-12 h-12 object-cover rounded"
                />
                <span className="text-sm text-gray-700 dark:text-gray-300 font-medium truncate max-w-[200px]">
                  {blindbox.blindBoxName}
                </span>
              </div>
              <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">
                {formatNumber(blindbox.revenue)}₫
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
