"use client";

import React, { useEffect, useState } from "react";
import { DollarSign, TrendingUp, HandCoins } from "lucide-react";
import { TbShoppingCartCheck } from "react-icons/tb";
import { BoxIconLine } from "@/icons";
import { getSellerStatisticsOverview } from "@/services/seller-dashboard/api-services";
import { StatisticRange, StatisticRangeText } from "@/const/seller";
import { SellerStatisticsOverview } from "@/services/seller-dashboard/typings";
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import Badge from "../ui/badge/Badge";
import { ArrowDownIcon, ArrowUpIcon } from "@/icons";

type MetricKey =
  | "actualRevenue"
  | "estimatedRevenue"
  | "totalProductsSold"
  | "totalOrders"
  | "averageOrderValue";

interface CardConfig {
  key: MetricKey;
  label: string;
  icon: React.ReactNode;
  suffix?: string;
  growthKey: keyof SellerStatisticsOverview;
  lastPeriodKey: keyof SellerStatisticsOverview;
}

const cardConfigs: CardConfig[] = [
  {
    key: "actualRevenue",
    label: "Doanh thu thực tế",
    icon: <DollarSign />,
    suffix: "₫",
    growthKey: "actualRevenueGrowthPercent",
    lastPeriodKey: "actualRevenueLastPeriod",
  },
  {
    key: "estimatedRevenue",
    label: "Doanh thu ước tính",
    icon: <HandCoins />,
    suffix: "₫",
    growthKey: "estimatedRevenueGrowthPercent",
    lastPeriodKey: "estimatedRevenueLastPeriod",
  },
  {
    key: "totalProductsSold",
    label: "Sản phẩm đã bán",
    icon: <TbShoppingCartCheck />,
    growthKey: "productsSoldGrowthPercent",
    lastPeriodKey: "totalProductsSoldLastPeriod",
  },
  {
    key: "totalOrders",
    label: "Tổng số đơn hàng",
    icon: <BoxIconLine />,
    growthKey: "ordersGrowthPercent",
    lastPeriodKey: "totalOrdersLastPeriod",
  },
  {
    key: "averageOrderValue",
    label: "Giá trị trung bình đơn",
    icon: <TrendingUp />,
    suffix: "₫",
    growthKey: "averageOrderValueGrowthPercent",
    lastPeriodKey: "averageOrderValueLastPeriod",
  },
];

export const EcommerceMetrics = () => {
  const [data, setData] = useState<SellerStatisticsOverview | null>(null);
  const [loading, setLoading] = useState(false);
  const [range, setRange] = useState<StatisticRange>(StatisticRange.DAY);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await getSellerStatisticsOverview({
        range,
        startDate,
        endDate,
      });
      if (response.value?.data) {
        setData(response.value.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [range, startDate, endDate]);

  const formatNumber = (num: number) =>
    num == null || isNaN(num) ? "0" : new Intl.NumberFormat("vi-VN").format(num);

  const formatGrowth = (p: number) => Math.abs(p).toFixed(2);

  const handleRangeChange = (val: StatisticRange) => {
    const now = new Date(); // không mutate

    let start: string | undefined;
    let end: string | undefined;

    switch (val) {
      case StatisticRange.WEEK: {
        start = now.toISOString();
        const nextWeek = new Date();
        nextWeek.setDate(now.getDate() + 7);
        end = nextWeek.toISOString();
        setStartDate(start);
        setEndDate(end);
        setRange(StatisticRange.WEEK);
        break;
      }

      case StatisticRange.MONTH: {
        start = now.toISOString();
        const nextMonth = new Date();
        nextMonth.setMonth(now.getMonth() + 1);
        end = nextMonth.toISOString();
        setStartDate(start);
        setEndDate(end);
        setRange(StatisticRange.MONTH);
        break;
      }

      case StatisticRange.QUARTER: {
        start = now.toISOString();
        const nextQuarter = new Date();
        nextQuarter.setMonth(now.getMonth() + 3);
        end = nextQuarter.toISOString();
        setStartDate(start);
        setEndDate(end);
        setRange(StatisticRange.QUARTER);
        break;
      }

      case StatisticRange.DAY: {
        setStartDate(now.toISOString());
        setEndDate(now.toISOString());
        setRange(StatisticRange.DAY);
        break;
      }

      default:
        setRange(val);
        break;
    }
  };


  return (
    <div className="border rounded-2xl bg-white dark:bg-gray-900 p-4 shadow-md">
      <div className="flex items-center gap-2 mb-4 justify-end">
        {/* <Select value={range} onValueChange={(val: StatisticRange) => setRange(val)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            {Object.values(StatisticRange)
              .filter((r) => r !== StatisticRange.TODAY)
              .map((r) => (
                <SelectItem key={r} value={r}>
                  {StatisticRangeText[r]}
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
        )} */}
        <Select
          value={range}
          onValueChange={handleRangeChange}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Chọn khoảng thời gian" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value={StatisticRange.DAY}>Ngày hôm nay</SelectItem>
            <SelectItem value={StatisticRange.WEEK}>7 ngày gần đây</SelectItem>
            <SelectItem value={StatisticRange.MONTH}>30 ngày gần đây</SelectItem>
            <SelectItem value={StatisticRange.QUARTER}>90 ngày gần đây</SelectItem>
            <SelectItem value={StatisticRange.CUSTOM}>Tùy chỉnh</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-2 md:gap-6">
        {cardConfigs.map((cfg) => {
          const value = data?.[cfg.key] as number;
          const growth = data?.[cfg.growthKey] as number;
          const lastPeriod = data?.[cfg.lastPeriodKey] as number;

          return (
            <div
              key={cfg.key}
              className="rounded-2xl border border-gray-200 bg-white p-5 dark:border-gray-800 dark:bg-gray-900 md:p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-xl dark:bg-gray-800">
                  {cfg.icon}
                </div>
              </div>

              <div className="flex items-end justify-between mt-5">
                <div>
                  <span className="text-sm text-gray-500 dark:text-gray-400">
                    {cfg.label}
                  </span>
                  <h4 className="mt-2 font-bold text-gray-800 text-title-sm dark:text-white/90 text-2xl">
                    {loading
                      ? "..."
                      : value
                        ? `${formatNumber(value)} ${cfg.suffix || ""}`
                        : `0 ${cfg.suffix || ""}`}
                  </h4>
                </div>
                <Dialog>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-3 text-xs rounded-xl"
                    >
                      Xem chi tiết
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-lg">
                    <DialogHeader>
                      <DialogTitle>{cfg.label}</DialogTitle>
                    </DialogHeader>
                    <div className="mt-4">
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Chỉ số</TableHead>
                            <TableHead className="text-right">Giá trị</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          <TableRow>
                            <TableCell>Kỳ hiện tại</TableCell>
                            <TableCell className="text-right">
                              {formatNumber(value)} {cfg.suffix}
                            </TableCell>
                          </TableRow>
                          <TableRow>
                            <TableCell>Kỳ trước</TableCell>
                            <TableCell className="text-right">
                              {formatNumber(lastPeriod)} {cfg.suffix}
                            </TableCell>
                          </TableRow>
                        </TableBody>
                      </Table>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
