"use client";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { Dropdown } from "../ui/dropdown/Dropdown";
import { MoreDotIcon } from "@/icons";
import { useState, useEffect } from "react";
import { DropdownItem } from "../ui/dropdown/DropdownItem";
import { StatisticRange } from "@/const/seller";
import { getSellerStatistics } from "@/services/seller-dashboard/api-services";
import { Skeleton } from "../ui/skeleton";
import { useTheme } from "@/context/ThemeContext";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

export default function MonthlyTarget() {
  const { theme } = useTheme();
  const [isOpen, setIsOpen] = useState(false);
  const [targetPercentage, setTargetPercentage] = useState(0);
  const [monthlyTarget] = useState(5000000);
  const [monthlyData, setMonthlyData] = useState<any>(null);
  const [todayData, setTodayData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [monthlyResponse, todayResponse] = await Promise.all([
          getSellerStatistics({ range: StatisticRange.MONTH }),
          getSellerStatistics({ range: StatisticRange.DAY }),
        ]);

        setMonthlyData(monthlyResponse);
        setTodayData(todayResponse);

        const overview = monthlyResponse?.overview;
        if (overview?.actualRevenue !== undefined) {
          const currentRevenue = overview.actualRevenue;
          const percentage = Math.min(
            (currentRevenue / monthlyTarget) * 100,
            100
          );
          setTargetPercentage(Math.round(percentage * 100) / 100);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [monthlyTarget]);

  const options: ApexOptions = {
    colors: [theme === "dark" ? "#60A5FA" : "#465FFF"],
    chart: {
      fontFamily: "Outfit, sans-serif",
      type: "radialBar",
      height: 330,
      sparkline: {
        enabled: true,
      },
      animations: {
        enabled: true,
        speed: 800,
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
          background: theme === "dark" ? "#374151" : "#E4E7EC",
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
            color: theme === "dark" ? "#F9FAFB" : "#000000",
            formatter: function (val) {
              return val + "%";
            },
          },
        },
      },
    },
    fill: {
      type: "solid",
      colors: [theme === "dark" ? "#60A5FA" : "#465FFF"],
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
    return `${amount.toLocaleString("vi-VN")} ₫`;
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
            {!isLoading && monthlyData ? (
              <ReactApexChart
                key={theme}
                options={options}
                series={[targetPercentage]}
                type="radialBar"
                height={330}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[330px] space-y-4">
                <Skeleton className="rounded-full w-[200px] h-[200px]" />
                <Skeleton className="h-4 w-40" />
              </div>
            )}
          </div>
        </div>
        <p className="mx-auto mt-10 w-full max-w-[380px] text-center text-sm text-gray-500 sm:text-base">
          {(() => {
            const overview = monthlyData?.overview;
            if (overview?.actualRevenue !== undefined) {
              return (
                <>
                  Bạn đã đạt được {targetPercentage}% mục tiêu tháng này
                  {overview.actualRevenueGrowthPercent !== undefined &&
                    (overview.actualRevenueGrowthPercent > 0
                      ? `, tăng ${overview.actualRevenueGrowthPercent.toFixed(
                        1
                      )}% so với tháng trước!`
                      : overview.actualRevenueGrowthPercent < 0
                        ? `, giảm ${Math.abs(
                          overview.actualRevenueGrowthPercent
                        ).toFixed(1)}% so với tháng trước.`
                        : `, không thay đổi so với tháng trước.`)}
                </>
              );
            } else if (isLoading) {
              return "Đang tải dữ liệu...";
            }
            return "Không có dữ liệu để hiển thị";
          })()}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Mục tiêu tháng
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {formatCurrency(monthlyTarget)}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Doanh thu thực tế tháng
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {(() => {
                const overview = (monthlyData as any)?.overview;
                if (overview && overview.actualRevenue !== undefined) {
                  return formatCurrency(overview.actualRevenue);
                }
                return "0 ₫";
              })()}
            </p>
          </div>

          <div className="text-center">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Doanh thu hôm nay
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              {(() => {
                const todayOverview = (todayData as any)?.overview;
                if (todayOverview && todayOverview.actualRevenue !== undefined) {
                  return formatCurrency(todayOverview.actualRevenue);
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
