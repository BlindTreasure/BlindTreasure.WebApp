"use client";
import React, { useState, useEffect } from "react";
import { ApexOptions } from "apexcharts";
import dynamic from "next/dynamic";
import { getSellerStatisticsTimeSeries } from "@/services/seller-dashboard/api-services";
import { StatisticRange } from "@/const/seller";
import { SellerStatisticsTimeSeries } from "@/services/seller-dashboard/typings";
import { useTheme } from "@/context/ThemeContext";
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
  const { theme } = useTheme();
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

  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const toISODate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    if (dateStr.includes('T')) return dateStr;
    return new Date(dateStr + 'T00:00:00.000Z').toISOString();
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {
        const response = await getSellerStatisticsTimeSeries({
          range: getStatisticRange(range),
          startDate: toISODate(startDate),
          endDate: toISODate(endDate),
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
  }, [range, startDate, endDate]);


  function groupByMonth(data: { categories: string[], sales: number[], actualRevenue: number[] }) {
    const result = {
      categories: [] as string[],
      sales: [] as number[],
      actualRevenue: [] as number[],
    };
    const monthMap: { [month: string]: { sales: number, actualRevenue: number } } = {};
    const now = new Date();
    const year = now.getFullYear();
    data.categories.forEach((date, idx) => {
      // date: "dd/MM" => MM/YYYY
      if (!date) return;
      const [d, m] = date.split("/");
      if (!m) return;
      const month = m.padStart(2, '0') + '/' + year;
      if (!monthMap[month]) monthMap[month] = { sales: 0, actualRevenue: 0 };
      const saleVal = Number(data.sales[idx]);
      const revVal = Number(data.actualRevenue[idx]);
      if (!isNaN(saleVal)) monthMap[month].sales += saleVal;
      if (!isNaN(revVal)) monthMap[month].actualRevenue += revVal;
    });
    const sortedMonths = Object.keys(monthMap).sort((a, b) => {
      const [ma, ya] = a.split('/').map(Number);
      const [mb, yb] = b.split('/').map(Number);
      return ya !== yb ? ya - yb : ma - mb;
    });
    sortedMonths.forEach((month) => {
      result.categories.push(month);
      result.sales.push(monthMap[month].sales);
      result.actualRevenue.push(monthMap[month].actualRevenue);
    });
    return result;
  }

  const getChartData = () => {
    if (statisticsData) {
      return {
        categories: statisticsData.categories || [],
        sales: statisticsData.sales || [],
        actualRevenue: statisticsData.actualRevenue || [],
      };
    }
    return { categories: [], sales: [], actualRevenue: [] };
  };

  const { categories, sales, actualRevenue } = (() => {
    let raw = getChartData();
    if (range === "year" || range === "quarter") {
      return groupByMonth(raw);
    }
    return raw;
  })();

  const options: ApexOptions = {
    chart: {
      type: "area",
      height: 310,
      toolbar: { show: false },
      fontFamily: "Outfit, sans-serif",
      background: "transparent",
    },
    colors: theme === "dark" ? ["#60A5FA", "#93C5FD"] : ["#465FFF", "#9CB9FF"],
    stroke: { curve: "straight", width: [2, 2] },
    fill: {
      type: "gradient",
      gradient: { opacityFrom: 0.55, opacityTo: 0 },
    },
    markers: {
      size: 0,
      strokeColors: theme === "dark" ? "#374151" : "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: { enabled: false },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: {
        lines: {
          show: true
        }
      },
      borderColor: theme === "dark" ? "#374151" : "#E5E7EB",
    },
    xaxis: {
      type: "category",
      categories,
      axisBorder: { show: false },
      axisTicks: { show: false },
      tooltip: { enabled: false },
      labels: {
        rotate: -45,
        trim: true,
        maxHeight: 60,
        style: {
          colors: theme === "dark" ? "#9CA3AF" : "#6B7280",
        },
        formatter: (val: string) => {
          if (range === "year" || range === "quarter") return val;
          return val;
        },
      },
    },
    yaxis: {
      labels: {
        style: {
          fontSize: "12px",
          colors: theme === "dark" ? "#9CA3AF" : "#6B7280",
        },
      },
    },
    tooltip: {
      enabled: true,
      theme: theme === "dark" ? "dark" : "light",
    },
    legend: {
      show: false,
    },
  };

  const series = [
    { name: "Bán", data: sales },
    { name: "Doanh thu", data: actualRevenue },
  ];

  const tabs: { label: string; value: typeof range }[] = [
    { label: "Ngày", value: "day" },
    { label: "Tuần", value: "week" },
    { label: "Tháng", value: "month" },
    { label: "Quý", value: "quarter" },
    { label: "Năm", value: "year" },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 px-5 pb-5 pt-5 sm:px-6 sm:pt-6">

      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Thống kê</h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Doanh thu theo từng giai đoạn</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Select value={range} onValueChange={(value) => setRange(value as typeof range)}>
            <SelectTrigger className="w-[120px]">
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
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={startDate ? startDate.slice(0, 10) : ''}
            onChange={e => setStartDate(e.target.value ? e.target.value : undefined)}
            placeholder="Từ ngày"
            style={{ minWidth: 120 }}
          />
          <span className="mx-1">-</span>
          <input
            type="date"
            className="border rounded px-2 py-1 text-sm"
            value={endDate ? endDate.slice(0, 10) : ''}
            onChange={e => setEndDate(e.target.value ? e.target.value : undefined)}
            placeholder="Đến ngày"
            style={{ minWidth: 120 }}
          />
        </div>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px] xl:min-w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-[310px]">
              <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
            </div>
          ) : (
            <ReactApexChart key={theme} options={options} series={series} type="area" height={310} />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
