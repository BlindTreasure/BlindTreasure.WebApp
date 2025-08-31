"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatisticRange } from "@/const/seller";
import { OrderSummary } from "@/services/admin-dashboard/typings";
import { useServiceOrderSummary } from "@/services/admin-dashboard/services";

export const OrderMetrics = () => {
  const [range, setRange] = useState<StatisticRange>(StatisticRange.TODAY);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [data, setData] = useState<OrderSummary>();

  const { mutate: getOrderSummary, isPending } = useServiceOrderSummary();

  const fetchData = (params?: { range: StatisticRange; startDate?: string; endDate?: string }) => {
    getOrderSummary(
      params ?? { range },
      { onSuccess: (res) => setData(res.value.data) }
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  const orderMetricLabels: Record<string, string> = {
    totalOrders: "Tổng số đơn hàng",
    pendingOrders: "Đang chờ xử lý",
    shippingOrders: "Đang vận chuyển",
    deliveredOrders: "Đã giao",
    cancelledOrders: "Đã hủy",
    inventoryOrders: "Đơn hàng tồn kho",
    refundedOrders: "Đã hoàn tiền",
    orderGrowthPercent: "Tăng trưởng đơn hàng (%)",
    averageOrderValue: "Giá trị đơn hàng trung bình",
    totalItemsSold: "Tổng số sản phẩm bán ra",
    estimatedOrders: "Số đơn hàng ước tính",
    estimatedAverageOrderValue: "Giá trị đơn hàng trung bình ước tính",
    estimatedItemsSold: "Số sản phẩm bán ra ước tính",
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <CardTitle>Tổng Quan Đơn Hàng</CardTitle>
            <CardDescription>Tổng hợp các chỉ số về đơn hàng</CardDescription>
          </div>

          <div className="flex flex-col gap-2 md:items-end">
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
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                placeholder="Từ ngày"
                className="text-sm flex-1"
              />
              <Input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                placeholder="Đến ngày"
                className="text-sm flex-1"
              />
            </div>
            <Button
              onClick={() => fetchData({ range, startDate, endDate })}
              size="sm"
              className="w-full"
            >
              Áp dụng
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isPending ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Tổng số đơn hàng</p>
              <p className="font-bold text-lg">{data?.totalOrders?.toLocaleString() ?? 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Đang chờ xử lý</p>
              <p className="font-bold text-lg text-orange-500">{data?.pendingOrders?.toLocaleString() ?? 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Đã giao</p>
              <p className="font-bold text-lg text-green-600">{data?.deliveredOrders?.toLocaleString() ?? 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Tăng trưởng</p>
              <p className="font-bold text-lg text-blue-600">{data?.orderGrowthPercent?.toFixed(2) ?? 'N/A'}%</p>
            </div>
          </div>
        )}
      </CardContent>

      <CardFooter>
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full">
              Chi tiết
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết Tổng Quan Đơn Hàng</DialogTitle>
            </DialogHeader>

            <div className="overflow-x-auto mt-4">
              <table className="w-full table-auto border border-border rounded-md">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Chỉ số</th>
                    <th className="px-4 py-3 text-left font-medium">Giá trị</th>
                  </tr>
                </thead>
                <tbody>
                  {data && Object.entries(data).map(([key, value], index) => (
                    <tr key={key} className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                      <td className="px-4 py-3 font-medium">{orderMetricLabels[key] ?? key}</td>
                      <td className="px-4 py-3">{typeof value === "number" ? value.toLocaleString() : value}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
