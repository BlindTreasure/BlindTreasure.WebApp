"use client";

import { useState, useEffect } from "react";
import { Line, LineChart, ResponsiveContainer, XAxis, YAxis, Tooltip, Legend } from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { StatisticRange } from "@/const/seller";
import { TimeSeries } from "@/services/admin-dashboard/typings";
import { useServiceTimeSeries } from "@/services/admin-dashboard/services";

type ChartMetric = 'grossSales' | 'platformRevenue' | 'orderCounts' | 'payoutCounts';

const metricLabels: Record<ChartMetric, string> = {
    grossSales: 'Doanh thu tổng',
    platformRevenue: 'Doanh thu nền tảng',
    orderCounts: 'Số đơn hàng',
    payoutCounts: 'Số lần thanh toán'
};

const estimatedMetricMap: Record<ChartMetric, keyof TimeSeries> = {
    grossSales: 'estimatedGrossSales',
    platformRevenue: 'estimatedPlatformRevenue',
    orderCounts: 'estimatedOrderCounts',
    payoutCounts: 'estimatedPayoutCounts'
};

export function OverviewChart() {
    const [range, setRange] = useState<StatisticRange>(StatisticRange.WEEK);
    const [startDate, setStartDate] = useState<string>();
    const [endDate, setEndDate] = useState<string>();
    const [selectedMetric, setSelectedMetric] = useState<ChartMetric>('grossSales');
    const [data, setData] = useState<TimeSeries>();

    const { mutate: getTimeSeries, isPending: isLoading } = useServiceTimeSeries();

    const fetchData = (params?: { range: StatisticRange; startDate?: string; endDate?: string }) => {
        getTimeSeries(
            params ?? { range },
            { onSuccess: (res) => setData(res.value.data) }
        );
    };

    useEffect(() => {
        fetchData();
    }, []);

    const chartData = data?.categories?.map((category, index) => ({
        name: category,
        actual: data[selectedMetric]?.[index] ?? 0,
        estimated: data[estimatedMetricMap[selectedMetric]]?.[index] ?? 0,
    })) ?? [];

    const isSingleDataPoint = chartData.length === 1;

    const formatYAxis = (value: number) => {
        if (selectedMetric === 'grossSales' || selectedMetric === 'platformRevenue') {
            return `$${Number(value).toLocaleString()}`;
        }
        return Number(value).toLocaleString();
    };

    return (
        <Card className="col-span-12">
            <CardHeader className="space-y-3">
                <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
                    <div>
                        <CardTitle>Biểu đồ tổng quan</CardTitle>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-2 md:items-center">
                        <Select
                            value={selectedMetric}
                            onValueChange={(val: ChartMetric) => setSelectedMetric(val)}
                        >
                            <SelectTrigger className="w-[160px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                {Object.entries(metricLabels).map(([key, label]) => (
                                    <SelectItem key={key} value={key}>{label}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>

                        <Select
                            value={range}
                            onValueChange={(val: StatisticRange) => {
                                setRange(val);
                                if (val !== StatisticRange.CUSTOM) {
                                    fetchData({ range: val, startDate, endDate });
                                }
                            }}
                        >
                            <SelectTrigger className="w-[130px]">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={StatisticRange.TODAY}>Hôm nay</SelectItem>
                                <SelectItem value={StatisticRange.WEEK}>Tuần</SelectItem>
                                <SelectItem value={StatisticRange.MONTH}>Tháng</SelectItem>
                                <SelectItem value={StatisticRange.QUARTER}>Quý</SelectItem>
                                <SelectItem value={StatisticRange.YEAR}>Năm</SelectItem>
                                <SelectItem value={StatisticRange.CUSTOM}>Tùy chọn</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                {range === StatisticRange.CUSTOM && (
                    <div className="flex flex-col gap-3 pt-2 border-t border-border/50">
                        <div className="flex flex-col sm:flex-row gap-2 items-center justify-end">
                            <Input
                                type="date"
                                value={startDate}
                                onChange={(e) => setStartDate(e.target.value)}
                                placeholder="Từ ngày"
                                className="text-sm w-fit"
                            />
                            <Input
                                type="date"
                                value={endDate}
                                onChange={(e) => setEndDate(e.target.value)}
                                placeholder="Đến ngày"
                                className="text-sm w-fit"
                            />
                            <Button
                                onClick={() => fetchData({ range, startDate, endDate })}
                                size="sm"
                                className="w-fit"
                            >
                                Áp dụng
                            </Button>
                        </div>
                    </div>
                )}
            </CardHeader>

            <CardContent className="pl-2">
                {isLoading ? (
                    <div className="w-full h-[350px] flex items-center justify-center">
                        <p className="text-muted-foreground">Đang tải biểu đồ...</p>
                    </div>
                ) : (
                    <ResponsiveContainer width="100%" height={350}>
                        <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                            <XAxis
                                dataKey="name"
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                            />
                            <YAxis
                                stroke="#888888"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickFormatter={formatYAxis}
                            />
                            <Tooltip
                                content={({ active, payload, label }) => {
                                    if (active && payload && payload.length) {
                                        return (
                                            <div className="bg-background border border-border rounded-md p-3 shadow-md">
                                                <p className="font-medium text-foreground mb-2">{label}</p>
                                                {payload.map((entry, index) => (
                                                    <div key={index} className="flex items-center gap-2">
                                                        <div
                                                            className="w-3 h-3 rounded-full"
                                                            style={{ backgroundColor: entry.color }}
                                                        />
                                                        <span className="text-sm text-muted-foreground">
                                                            {entry.dataKey === 'actual' ? 'Thực tế' : 'Ước tính'}:
                                                        </span>
                                                        <span className="font-medium">
                                                            {formatYAxis(Number(entry.value))}
                                                        </span>
                                                    </div>
                                                ))}
                                            </div>
                                        );
                                    }
                                    return null;
                                }}
                            />
                            <Legend />
                            <Line
                                type="monotone"
                                dataKey="actual"
                                name="Thực tế"
                                stroke="#465FFF"
                                strokeWidth={2}
                                dot={{ fill: "#465FFF", stroke: "white", strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, stroke: "#465FFF", strokeWidth: 2 }}
                            />
                            <Line
                                type="monotone"
                                dataKey="estimated"
                                name="Ước tính"
                                stroke="#9CB9FF"
                                strokeWidth={2}
                                dot={{ fill: "#9CB9FF", stroke: "white", strokeWidth: 2, r: 6 }}
                                activeDot={{ r: 8, stroke: "#9CB9FF", strokeWidth: 2 }}
                            />
                        </LineChart>
                    </ResponsiveContainer>
                )}
            </CardContent>
        </Card>
    );
}