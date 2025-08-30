"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogClose,
} from "@/components/ui/dialog";
import { StatisticRange } from "@/const/seller";
import { TopCategory } from "@/services/admin-dashboard/typings";
import { useServiceTopCategories } from "@/services/admin-dashboard/services";

export const TopCategories = () => {
  const [range, setRange] = useState<StatisticRange>(StatisticRange.TODAY);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [data, setData] = useState<TopCategory[]>([]);

  const { mutate: getTopCategories, isPending } = useServiceTopCategories();

  const fetchData = (params?: {
    range: StatisticRange;
    startDate?: string;
    endDate?: string;
  }) => {
    getTopCategories(
      params ?? { range },
      {
        onSuccess: (res) =>
          setData(Array.isArray(res.value.data) ? res.value.data : []),
      }
    );
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <CardTitle>Top Danh Mục</CardTitle>
            <CardDescription>Danh mục có doanh thu cao nhất.</CardDescription>
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
              className="w-1/3 mx-auto"
            >
              Áp dụng
            </Button>
          </div>
        )}
      </CardHeader>

      <CardContent>
        {isPending ? (
          <p>Đang tải...</p>
        ) : (
          <div className="space-y-4">
            {data.length > 0 ? (
              data.map((cat) => (
                <div
                  key={cat.categoryName}
                  className="flex justify-between text-sm"
                >
                  <span className="font-medium">{cat.categoryName}</span>
                  <span className="text-muted-foreground">
                    {cat.revenue.toLocaleString()}
                  </span>
                </div>
              ))
            ) : (
              <p>Không có dữ liệu danh mục.</p>
            )}
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

          <DialogContent className="max-w-3xl max-h-[70vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết Top Danh Mục</DialogTitle>
            </DialogHeader>

            <div className="overflow-x-auto mt-4">
              <table className="w-full table-auto border border-border rounded-md">
                <thead className="bg-muted">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium">Danh mục</th>
                    <th className="px-4 py-3 text-left font-medium">Số đơn hàng</th>
                    <th className="px-4 py-3 text-left font-medium">Doanh thu</th>
                    <th className="px-4 py-3 text-left font-medium">Số đơn hàng ước tính</th>
                    <th className="px-4 py-3 text-left font-medium">Doanh thu ước tính</th>
                  </tr>
                </thead>
                <tbody>
                  {data.map((cat, index) => (
                    <tr
                      key={cat.categoryName}
                      className={`border-t border-border ${
                        index % 2 === 0 ? "bg-background" : "bg-muted/30"
                      }`}
                    >
                      <td className="px-4 py-3 font-medium">{cat.categoryName}</td>
                      <td className="px-4 py-3">{cat.orderCount}</td>
                      <td className="px-4 py-3">{cat.revenue.toLocaleString()}</td>
                      <td className="px-4 py-3">{cat.estimatedOrderCount}</td>
                      <td className="px-4 py-3">{cat.estimatedRevenue.toLocaleString()}</td>
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
