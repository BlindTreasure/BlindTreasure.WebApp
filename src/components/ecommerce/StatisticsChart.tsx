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
import { Checkbox } from "@/components/ui/checkbox";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

const StatisticsChart = () => {
  const { theme } = useTheme();

  const [range, setRange] = useState<StatisticRange>(StatisticRange.DAY);
  const [statisticsData, setStatisticsData] = useState<SellerStatisticsTimeSeries | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const [selectedSeries, setSelectedSeries] = useState<string[]>([
    "sales",
    "actualRevenue",
    "estimatedRevenue",
  ]);
  const toggleSeries = (key: string) => {
    setSelectedSeries((prev) =>
      prev.includes(key) ? prev.filter((x) => x !== key) : [...prev, key]
    );
  };

  const [startDate, setStartDate] = useState<string | undefined>(undefined);
  const [endDate, setEndDate] = useState<string | undefined>(undefined);

  const toISODate = (dateStr?: string) => {
    if (!dateStr) return undefined;
    if (dateStr.includes("T")) return dateStr;
    return new Date(dateStr + "T00:00:00.000Z").toISOString();
  };

  useEffect(() => {
    const fetchStatistics = async () => {
      setIsLoading(true);
      try {
        const response = await getSellerStatisticsTimeSeries({
          range,
          startDate: toISODate(startDate),
          endDate: toISODate(endDate),
        });
        if (response?.value?.data) setStatisticsData(response.value.data);
        else if (response?.value) setStatisticsData(response.value as any);
        else setStatisticsData(response as any);
      } catch (error) {
        console.error("Error fetching statistics:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchStatistics();
  }, [range, startDate, endDate]);

  function groupByMonth(data: {
    categories: string[];
    sales: number[];
    actualRevenue: number[];
    estimatedRevenue: number[];
  }) {
    const result = {
      categories: [] as string[],
      sales: [] as number[],
      actualRevenue: [] as number[],
      estimatedRevenue: [] as number[],
    };
    const monthMap: Record<
      string,
      { sales: number; actualRevenue: number; estimatedRevenue: number }
    > = {};
    const year = new Date().getFullYear();

    data.categories.forEach((date, idx) => {
      if (!date) return;
      const [, m] = date.split("/");
      if (!m) return;
      const month = m.padStart(2, "0") + "/" + year;
      if (!monthMap[month])
        monthMap[month] = { sales: 0, actualRevenue: 0, estimatedRevenue: 0 };
      const s = Number(data.sales[idx]);
      const a = Number(data.actualRevenue[idx]);
      const e = Number(data.estimatedRevenue[idx]);
      if (!isNaN(s)) monthMap[month].sales += s;
      if (!isNaN(a)) monthMap[month].actualRevenue += a;
      if (!isNaN(e)) monthMap[month].estimatedRevenue += e;
    });

    Object.keys(monthMap)
      .sort((A, B) => {
        const [ma, ya] = A.split("/").map(Number);
        const [mb, yb] = B.split("/").map(Number);
        return ya !== yb ? ya - yb : ma - mb;
      })
      .forEach((m) => {
        result.categories.push(m);
        result.sales.push(monthMap[m].sales);
        result.actualRevenue.push(monthMap[m].actualRevenue);
        result.estimatedRevenue.push(monthMap[m].estimatedRevenue);
      });

    return result;
  }

  const getChartData = () => {
    if (statisticsData) {
      return {
        categories: statisticsData.categories || [],
        sales: statisticsData.sales || [],
        actualRevenue: statisticsData.actualRevenue || [],
        estimatedRevenue: statisticsData.estimatedRevenue || [],
      };
    }
    return {
      categories: [],
      sales: [],
      actualRevenue: [],
      estimatedRevenue: [],
    };
  };

  const { categories, sales, actualRevenue, estimatedRevenue } = (() => {
    const raw = getChartData();
    if (range === StatisticRange.YEAR || range === StatisticRange.QUARTER)
      return groupByMonth(raw);
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
    colors:
      theme === "dark"
        ? ["#60A5FA", "#93C5FD", "#FACC15"]
        : ["#465FFF", "#9CB9FF", "#F59E0B"],
    stroke: { curve: "straight", width: [2, 2, 2] },
    fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
    markers: {
      size: 0,
      strokeColors: theme === "dark" ? "#374151" : "#fff",
      strokeWidth: 2,
      hover: { size: 6 },
    },
    dataLabels: { enabled: false },
    grid: {
      xaxis: { lines: { show: false } },
      yaxis: { lines: { show: true } },
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
        style: { colors: theme === "dark" ? "#9CA3AF" : "#6B7280" },
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
    tooltip: { enabled: true, theme: theme === "dark" ? "dark" : "light" },
    legend: { show: true },
  };

  const series = [
    selectedSeries.includes("sales") && { name: "Bán", data: sales },
    selectedSeries.includes("actualRevenue") && {
      name: "Doanh thu",
      data: actualRevenue,
    },
    selectedSeries.includes("estimatedRevenue") && {
      name: "Doanh thu ước tính",
      data: estimatedRevenue,
    },
  ].filter(Boolean) as { name: string; data: number[] }[];

  const tabs: { label: string; value: StatisticRange }[] = [
    { label: "Hôm nay", value: StatisticRange.DAY },
    { label: "Tuần", value: StatisticRange.WEEK },
    { label: "Tháng", value: StatisticRange.MONTH },
    { label: "Quý", value: StatisticRange.QUARTER },
    { label: "Năm", value: StatisticRange.YEAR },
    { label: "Tùy chọn", value: StatisticRange.CUSTOM },
  ];

  return (
    <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
      <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
        <div>
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
            Thống kê
          </h3>
          <p className="text-gray-500 dark:text-gray-400 text-sm">
            Doanh thu theo từng giai đoạn
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-2 items-center">
          <Select
            value={range}
            onValueChange={(value) => setRange(value as StatisticRange)}
          >
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

          {range === StatisticRange.CUSTOM && (
            <div className="flex flex-col sm:flex-row gap-2 items-center">
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm dark:bg-gray-900 date-icon-black dark:date-icon-white"
                value={startDate ? startDate.slice(0, 10) : ""}
                onChange={(e) => setStartDate(e.target.value || undefined)}
                style={{ minWidth: 120 }}
              />
              <span className="mx-1">-</span>
              <input
                type="date"
                className="border rounded px-2 py-1 text-sm dark:bg-gray-900 date-icon-black dark:date-icon-white"
                value={endDate ? endDate.slice(0, 10) : ""}
                onChange={(e) => setEndDate(e.target.value || undefined)}
                style={{ minWidth: 120 }}
              />
            </div>
          )}
        </div>
      </div>

      <div className="flex gap-4 mb-4">
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={selectedSeries.includes("sales")}
            onCheckedChange={() => toggleSeries("sales")}
          />
          Bán
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={selectedSeries.includes("actualRevenue")}
            onCheckedChange={() => toggleSeries("actualRevenue")}
          />
          Doanh thu
        </label>
        <label className="flex items-center gap-2 text-sm">
          <Checkbox
            checked={selectedSeries.includes("estimatedRevenue")}
            onCheckedChange={() => toggleSeries("estimatedRevenue")}
          />
          Doanh thu ước tính
        </label>
      </div>

      <div className="max-w-full overflow-x-auto">
        <div className="min-w-[1000px] xl:min-w-full">
          {isLoading ? (
            <div className="flex items-center justify-center h-[310px]">
              <div className="text-gray-500 dark:text-gray-400">
                Đang tải dữ liệu...
              </div>
            </div>
          ) : (
            <ReactApexChart
              key={theme}
              options={options}
              series={series}
              type="area"
              height={310}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default StatisticsChart;
