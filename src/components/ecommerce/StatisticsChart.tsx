"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getSellerStatisticsTimeSeries } from "@/services/seller-dashboard/api-services";
import { StatisticRange } from "@/const/seller";
import { SellerStatisticsTimeSeries } from "@/services/seller-dashboard/typings";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const ReactApexChart = dynamic(() => import("react-apexcharts"), {
  ssr: false,
});

const StatisticsChart = () => {
  const [range, setRange] = useState<"day" | "week" | "month" | "quarter" | "year">("month");
  const [statisticsData, setStatisticsData] = useState<SellerStatisticsTimeSeries | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const getStatisticRange = (range: string) => {
    switch (range) {
      case "day":
        return StatisticRange.DAY;
      case "week":
        return StatisticRange.WEEK;
      case "month":
        return StatisticRange.MONTH;
      case "quarter":
        return StatisticRange.QUARTER;
      case "year":
        return StatisticRange.YEAR;
      default:
        return StatisticRange.MONTH;
    }
  };
  
  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {

        const response = await getSellerStatisticsTimeSeries({
          range: getStatisticRange(range),
        });

        if (response.value?.data) {
          setStatisticsData(response.value.data);
        } else if (response.value) {
          setStatisticsData(response.value as any);
        } else if (response) {
          setStatisticsData(response as any);
        }
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchStatistics();
  }, [range]);

  const getChartData = () => {
    if (statisticsData) {
      return {
        categories: statisticsData.categories || [],
        sales: statisticsData.sales || [],
        revenue: statisticsData.revenue || [],
      };
    }

    return { categories: [], sales: [], revenue: [] };
  };

  const { categories, sales, revenue } = getChartData();

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
    },
    colors: ["#465FFF", "#9CB9FF"],
    stroke: { curve: "straight", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: { enabled: false },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: ["#6B7280"],
        },
      },
    },
    tooltip: {
      enabled: true,
    },
    legend: {
      show: false,
    },
  };

  const series = [
    { name: "Sales", data: sales },
    { name: "Revenue", data: revenue },
  ];

  const tabs: { label: string; value: typeof range }[] = [
    { label: "Ngày", value: "day" },
    { label: "Tuần", value: "week" },
    { label: "Tháng", value: "month" },
    { label: "Quý", value: "quarter" },
    { label: "Năm", value: "year" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Thống kê</h3>
          <p className="text-gray-500 text-sm">Doanh thu theo từng giai đoạn</p>
        </div>

        <Select value={range} onValueChange={(value) => setRange(value as typeof range)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            {tabs.map((tab) => (
              <SelectItem key={tab.value} value={tab.value}>
                {tab.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px] xl:min-w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-[310px]">
              <div className="text-gray-500">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <ReactApexChart options={options} series={series} type="area" height={310} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
