"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useState, useEffect, useRef } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { StatisticRange } from "@/const/seller";
import { getSellerStatistics } from "@/services/seller-dashboard/api-services";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const [isOpen, setIsOpen] = useState(false);
  const [targetPercentage, setTargetPercentage] = useState(0);
  const [monthlyTarget] = useState(5000000);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const hasCalledApiRef = useRef(false);

  useEffect(() => {
    if (hasCalledApiRef.current) return;

    const fetchData = async () => {
      hasCalledApiRef.current = true;
      setIsLoading(true);

      try {
        const monthlyResponse = await getSellerStatistics({
          range: StatisticRange.MONTH,
        });
        setMonthlyData(monthlyResponse);

        const todayResponse = await getSellerStatistics({
          range: StatisticRange.DAY,
        });
        setTodayData(todayResponse);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (!monthlyData) return;

    const overview = (monthlyData as any)?.overview;
    if (overview && overview.totalRevenue !== undefined) {
      const currentRevenue = overview.totalRevenue;
      const percentage = Math.min((currentRevenue / monthlyTarget) * 100, 100);
      setTargetPercentage(Math.round(percentage * 100) / 100);
    }
  }, [monthlyData, monthlyTarget]);

  const series = [targetPercentage];
  const options: ApexOptions = {
    colors: ["#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
    },
    plotOptions: {
      radialBar: {
        startAngle: -85,
        endAngle: 85,
        hollow: {
          size: "80%",
        },
        track: {
          background: "#E4E7EC",
          strokeWidth: "100%",
          margin: 5,
        },
        dataLabels: {
          name: {
            show: false,
          },
          value: {
            fontSize: "36px",
            fontWeight: "600",
            offsetY: -40,
            color: "#1D2939",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: ["#465FFF"],
    },
    stroke: {
      lineCap: "round",
    },
    labels: ["Progress"],
  };

  function toggleDropdown() {
    setIsOpen(!isOpen);
  }

  function closeDropdown() {
    setIsOpen(false);
  }


  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `${(amount / 1000000).toFixed(1)}M ₫`;
    } else if (amount >= 1000) {
      return `${(amount / 1000).toFixed(1)}K ₫`;
    }
    return `${amount.toLocaleString('vi-VN')} ₫`;
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-gray-100 dark:border-gray-800 dark:bg-white/[0.03]">
      <div className="px-5 pt-5 bg-white shadow-default rounded-2xl pb-11 dark:bg-gray-900 sm:px-6 sm:pt-6">
        <div className="flex justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white/90">
              Mục tiêu hàng tháng
            </h3>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Mục tiêu doanh thu tháng này
            </p>
          </div>
          <div className="relative z-50">
            <button
              onClick={toggleDropdown}
              className="dropdown-toggle flex h-8 w-8 items-center justify-center rounded-md border border-gray-200 bg-white text-gray-500 hover:bg-gray-50 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:hover:bg-gray-700"
            >
              <MoreDotIcon />
            </button>
            <Dropdown
              isOpen={isOpen}
              onClose={closeDropdown}
              className="w-40 p-2"
            >
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Xem chi tiết
              </DropdownItem>
              <DropdownItem
                onItemClick={closeDropdown}
                className="flex w-full font-normal text-left text-gray-500 rounded-lg hover:bg-gray-100 hover:text-gray-700 dark:text-gray-400 dark:hover:bg-white/5 dark:hover:text-gray-300"
              >
                Xuất dữ liệu
              </DropdownItem>
            </Dropdown>
          </div>
        </div>
        <div className="relative ">
          <div className="max-h-[330px]">
            <ReactApexChart
              options={options}
              series={series}
              type="radialBar"
              height={330}
            />
          </div>

          {(() => {
            const overview = (monthlyData as any)?.overview;
            return overview && overview.revenueGrowthPercent !== undefined && (
              <span className={`absolute left-1/2 top-full -translate-x-1/2 -translate-y-[95%] rounded-full px-3 py-1 text-xs font-medium ${overview.revenueGrowthPercent >= 0
                ? 'bg-success-50 text-success-600 dark:bg-success-500/15 dark:text-success-500'
                : 'bg-red-50 text-red-600 dark:bg-red-500/15 dark:text-red-500'
                }`}>
                {overview.revenueGrowthPercent > 0 ? '+' : ''}
                {overview.revenueGrowthPercent.toFixed(1)}%
              </span>
            );
          })()}
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {(() => {
            const overview = (monthlyData as any)?.overview;

            if (overview && overview.totalRevenue !== undefined) {
              return (
                <>
                  Bạn đã đạt được {targetPercentage}% mục tiêu tháng này
                  {overview.revenueGrowthPercent !== undefined && (
                    overview.revenueGrowthPercent > 0
                      ? `, tăng ${overview.revenueGrowthPercent.toFixed(1)}% so với tháng trước!`
                      : overview.revenueGrowthPercent < 0
                        ? `, giảm ${Math.abs(overview.revenueGrowthPercent).toFixed(1)}% so với tháng trước.`
                        : `, không thay đổi so với tháng trước.`
                  )}
                </>
              );
            } else if (isLoading) {
              return "Đang tải dữ liệu...";
            } else {
              return "Không có dữ liệu để hiển thị";
            }
          })()}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Mục tiêu tháng</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(monthlyTarget)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Doanh thu tháng</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {(() => {
                const overview = (monthlyData as any)?.overview;
                if (overview && overview.totalRevenue !== undefined) {
                  return formatCurrency(overview.totalRevenue);
                }
                return "0 ₫";
              })()}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">Doanh thu hôm nay</p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {(() => {
                const todayOverview = (todayData as any)?.overview;
                if (todayOverview && todayOverview.totalRevenue !== undefined) {
                  return formatCurrency(todayOverview.totalRevenue);
                }
                return "0 ₫";
              })()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
