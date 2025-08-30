"use client";
import React, { useState, useEffect } from "react";
import dynamic from "next/dynamic";
import { StatisticRange } from "@/const/seller";
import { TimeSeries } from "@/services/admin-dashboard/typings";
import { useServiceTimeSeries } from "@/services/admin-dashboard/services";
import { useTheme } from "@/context/ThemeContext";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { ApexOptions } from "apexcharts";

const ReactApexChart = dynamic(() => import("react-apexcharts"), { ssr: false });

type ChartMetric = "grossSales" | "platformRevenue" | "orderCounts" | "payoutCounts";

const metricLabels: Record<ChartMetric, string> = {
    grossSales: "Doanh thu tổng",
    platformRevenue: "Doanh thu nền tảng",
    orderCounts: "Số đơn hàng",
    payoutCounts: "Số lần thanh toán",
};

const estimatedMetricMap: Record<ChartMetric, keyof TimeSeries> = {
    grossSales: "estimatedGrossSales",
    platformRevenue: "estimatedPlatformRevenue",
    orderCounts: "estimatedOrderCounts",
    payoutCounts: "estimatedPayoutCounts",
};

export default function OverviewChart() {
    const { theme } = useTheme();

    const [range, setRange] = useState<StatisticRange>(StatisticRange.WEEK);
    const [startDate, setStartDate] = useState<string | undefined>(undefined);
    const [endDate, setEndDate] = useState<string | undefined>(undefined);
    const [selectedMetrics, setSelectedMetrics] = useState<ChartMetric[]>(["grossSales"]);
    const [data, setData] = useState<TimeSeries | undefined>(undefined);
    const [isLoading, setIsLoading] = useState(false);

    const { mutate: getTimeSeries } = useServiceTimeSeries();

    const fetchData = (params?: { range: StatisticRange; startDate?: string; endDate?: string }) => {
        setIsLoading(true);
        getTimeSeries(params ?? { range }, {
            onSuccess: (res) => {
                setData(res?.value?.data);
                setIsLoading(false);
            },
            onError: () => setIsLoading(false),
        });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const toNumber = (v: unknown): number | null => {
        if (v === null || v === undefined) return null;
        const s = String(v).replace(/[^\d.-]/g, "");
        if (!s) return null;
        const n = Number(s);
        return Number.isFinite(n) ? n : null;
    };

    const groupByMonth = (values: (number | null)[], categories: string[]) => {
        const monthMap: Record<string, number> = {};

        categories.forEach((dateStr, idx) => {
            if (!dateStr) return;
            const [dayStr, monthStr] = dateStr.split(/[\/-]/); // parse "dd/mm"
            const month = Number(monthStr);
            if (!month) return;

            const key = `Tháng ${month}`;
            if (!monthMap[key]) monthMap[key] = 0;
            if (values[idx] !== null) monthMap[key] += values[idx] as number;
        });

        const sortedKeys = Object.keys(monthMap).sort((a, b) => {
            const ma = Number(a.replace("Tháng ", ""));
            const mb = Number(b.replace("Tháng ", ""));
            return ma - mb;
        });

        return {
            categories: sortedKeys,
            values: sortedKeys.map((k) => monthMap[k]),
        };
    };

    const buildSeries = (): ApexAxisChartSeries => {
        if (!data) return [];

        return selectedMetrics.flatMap((metric) => {
            let actualArr = (data[metric] ?? []).map(toNumber);
            let estimatedArr = (data[estimatedMetricMap[metric]] ?? []).map(toNumber);
            let chartCategories = data?.categories ?? [];

            if (range === StatisticRange.QUARTER || range === StatisticRange.YEAR) {
                const groupedActual = groupByMonth(actualArr, data.categories ?? []);
                const groupedEstimated = groupByMonth(estimatedArr, data.categories ?? []);
                actualArr = groupedActual.values;
                estimatedArr = groupedEstimated.values;
                chartCategories = groupedActual.categories;
            }


            return [
                { name: `${metricLabels[metric]} (Thực tế)`, type: "area", data: actualArr },
                { name: `${metricLabels[metric]} (Ước tính)`, type: "area", data: estimatedArr },
            ];
        });
    };

    const series = buildSeries();

    const chartCategories =
        range === StatisticRange.QUARTER || range === StatisticRange.YEAR
            ? groupByMonth(
                selectedMetrics.flatMap((m) => (data?.[m] ?? []).map(toNumber)),
                data?.categories ?? []
            ).categories
            : data?.categories ?? [];

    const tabs: { label: string; value: StatisticRange }[] = [
        { label: "Hôm nay", value: StatisticRange.TODAY },
        { label: "Tuần", value: StatisticRange.WEEK },
        { label: "Tháng", value: StatisticRange.MONTH },
        { label: "Quý", value: StatisticRange.QUARTER },
        { label: "Năm", value: StatisticRange.YEAR },
        { label: "Tùy chọn", value: StatisticRange.CUSTOM },
    ];

    const paletteLight = ["#465FFF", "#9CB9FF", "#FF6B6B", "#FFBABA", "#22C55E", "#86EFAC", "#F59E0B", "#FCD34D"];
    const paletteDark = ["#60A5FA", "#93C5FD", "#FB7185", "#FECACA", "#34D399", "#BBF7D0", "#FACC15", "#FDE68A"];

    const options: ApexOptions = {
        chart: { type: "area", height: 310, toolbar: { show: false }, fontFamily: "Outfit, sans-serif", background: "transparent" },
        colors: theme === "dark" ? paletteDark : paletteLight,
        stroke: { curve: "straight", width: 2 },
        fill: { type: "gradient", gradient: { opacityFrom: 0.55, opacityTo: 0 } },
        markers: { size: 0, strokeColors: theme === "dark" ? "#374151" : "#fff", strokeWidth: 2, hover: { size: 6 } },
        dataLabels: { enabled: false },
        grid: { xaxis: { lines: { show: false } }, yaxis: { lines: { show: true } }, borderColor: theme === "dark" ? "#374151" : "#E5E7EB" },
        xaxis: { type: "category", categories: chartCategories, axisBorder: { show: false }, axisTicks: { show: false }, tooltip: { enabled: false }, labels: { rotate: -45, trim: true, maxHeight: 60, style: { colors: theme === "dark" ? "#9CA3AF" : "#6B7280" } } },
        yaxis: { labels: { style: { fontSize: "12px", colors: theme === "dark" ? "#9CA3AF" : "#6B7280" } } },
        tooltip: { enabled: true, theme: theme === "dark" ? "dark" : "light" },
        legend: { show: true },
    };

    return (
        <div className="rounded-2xl border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-900 px-5 pb-5 pt-5 sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-5 mb-6 sm:flex-row sm:justify-between">
                <div>
                    <h3 className="text-lg font-semibold text-gray-800 dark:text-white">Biểu đồ tổng quan</h3>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">Doanh thu & hoạt động theo từng giai đoạn</p>
                </div>

                <div className="flex flex-col sm:flex-row gap-2 items-center">
                    <Select
                        value={range}
                        onValueChange={(val: StatisticRange) => {
                            setRange(val);
                            if (val !== StatisticRange.CUSTOM) fetchData({ range: val, startDate, endDate });
                        }}
                    >
                        <SelectTrigger className="w-[140px]">
                            <SelectValue placeholder="Chọn khoảng" />
                        </SelectTrigger>
                        <SelectContent>
                            {tabs.map((tab) => <SelectItem key={tab.value} value={tab.value}>{tab.label}</SelectItem>)}
                        </SelectContent>
                    </Select>

                    {range === StatisticRange.CUSTOM && (
                        <div className="flex flex-col sm:flex-row gap-2 items-center">
                            <input type="date" className="border rounded px-2 py-1 text-sm dark:bg-gray-900" value={startDate ?? ""} onChange={(e) => setStartDate(e.target.value || undefined)} />
                            <span className="mx-1">-</span>
                            <input type="date" className="border rounded px-2 py-1 text-sm dark:bg-gray-900" value={endDate ?? ""} onChange={(e) => setEndDate(e.target.value || undefined)} />
                            <Button onClick={() => fetchData({ range, startDate, endDate })} size="sm">Áp dụng</Button>
                        </div>
                    )}
                </div>
            </div>

            <div className="flex flex-wrap gap-4 mb-4">
                {Object.entries(metricLabels).map(([key, label]) => {
                    const metric = key as ChartMetric;
                    return (
                        <label key={key} className="flex items-center gap-2 text-sm cursor-pointer">
                            <Checkbox
                                checked={selectedMetrics.includes(metric)}
                                onCheckedChange={(checked) => setSelectedMetrics((prev) => checked ? [...prev, metric] : prev.filter((m) => m !== metric))}
                            />
                            {label}
                        </label>
                    );
                })}
            </div>

            <div className="max-w-full overflow-x-auto">
                <div className="min-w-[1000px] xl:min-w-full">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-[310px]">
                            <div className="text-gray-500 dark:text-gray-400">Đang tải dữ liệu...</div>
                        </div>
                    ) : (
                        <ReactApexChart options={options} series={series as ApexAxisChartSeries} type="area" height={310} />
                    )}
                </div>
            </div>
        </div>
    );
}

