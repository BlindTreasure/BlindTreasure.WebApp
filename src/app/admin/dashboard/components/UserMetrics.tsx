"use client";

import { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { StatisticRange } from "@/const/seller";
import { CustomerSummary, SellerSummary } from "@/services/admin-dashboard/typings";
import { useServiceCustomerSummary, useServiceSellerSummary } from "@/services/admin-dashboard/services";

export const UserMetrics = () => {
  const [range, setRange] = useState<StatisticRange>(StatisticRange.MONTH);
  const [startDate, setStartDate] = useState<string>();
  const [endDate, setEndDate] = useState<string>();
  const [sellers, setSellers] = useState<SellerSummary>();
  const [customers, setCustomers] = useState<CustomerSummary>();

  const { mutate: getSellerSummary, isPending: isSellerLoading } = useServiceSellerSummary();
  const { mutate: getCustomerSummary, isPending: isCustomerLoading } = useServiceCustomerSummary();

  const isLoading = isSellerLoading || isCustomerLoading;

  const fetchData = (params?: { range: StatisticRange; startDate?: string; endDate?: string }) => {
    const requestParams = params ?? { range };
    getSellerSummary(requestParams, { onSuccess: (res) => setSellers(res.value.data) });
    getCustomerSummary(requestParams, { onSuccess: (res) => setCustomers(res.value.data) });
  };

  useEffect(() => {
    fetchData();
  }, []);

  const customerMetricLabels: Record<string, string> = {
    totalCustomers: "Tổng số khách hàng",
    newCustomersThisPeriod: "Khách hàng mới trong kỳ",
  };

  return (
    <Card>
      <CardHeader className="space-y-3">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-3">
          <div>
            <CardTitle>Tổng Quan Người Dùng</CardTitle>
            <CardDescription>Tổng hợp thông tin người bán và khách hàng</CardDescription>
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
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <p className="text-muted-foreground">Đang tải...</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="space-y-1">
              <p className="text-muted-foreground">Tổng số người bán</p>
              <p className="font-bold text-lg">{sellers?.totalSellers?.toLocaleString() ?? 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Người bán hoạt động</p>
              <p className="font-bold text-lg text-green-600">{sellers?.activeSellers?.toLocaleString() ?? 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Tổng số khách hàng</p>
              <p className="font-bold text-lg">{customers?.totalCustomers?.toLocaleString() ?? 'N/A'}</p>
            </div>
            <div className="space-y-1">
              <p className="text-muted-foreground">Khách hàng mới</p>
              <p className="font-bold text-lg text-blue-600">{customers?.newCustomersThisPeriod?.toLocaleString() ?? 'N/A'}</p>
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

          <DialogContent className="max-w-5xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle>Chi tiết Tổng Quan Người Dùng</DialogTitle>
            </DialogHeader>

            <div className="space-y-6 mt-4">
              <div>
                <h3 className="text-lg font-semibold mb-3">Chỉ số Người Bán</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border border-border rounded-md mb-4">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Chỉ số</th>
                        <th className="px-4 py-3 text-left font-medium">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sellers && (
                        <>
                          <tr className="border-t border-border bg-background">
                            <td className="px-4 py-3 font-medium">Tổng số người bán</td>
                            <td className="px-4 py-3">{sellers.totalSellers.toLocaleString()}</td>
                          </tr>
                          <tr className="border-t border-border">
                            <td className="px-4 py-3 font-medium">Người bán hoạt động</td>
                            <td className="px-4 py-3">{sellers.activeSellers.toLocaleString()}</td>
                          </tr>
                          {sellers.estimatedActiveSellers !== undefined && (
                            <tr className="border-t border-border bg-background">
                              <td className="px-4 py-3 font-medium">Người bán hoạt động ước tính</td>
                              <td className="px-4 py-3">{sellers.estimatedActiveSellers.toLocaleString()}</td>
                            </tr>
                          )}
                        </>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              {sellers?.topSellers && sellers.topSellers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Người Bán Hàng Top</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-border rounded-md">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Tên người bán</th>
                          <th className="px-4 py-3 text-left font-medium">Tổng doanh thu</th>
                          <th className="px-4 py-3 text-left font-medium">Phí nền tảng</th>
                          <th className="px-4 py-3 text-left font-medium">Số lần thanh toán</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellers.topSellers.map((seller, index) => (
                          <tr key={seller.sellerId} className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                            <td className="px-4 py-3 font-medium">{seller.sellerName}</td>
                            <td className="px-4 py-3">{seller.totalRevenue.toLocaleString()}</td>
                            <td className="px-4 py-3">{seller.platformFeeGenerated.toLocaleString()}</td>
                            <td className="px-4 py-3">{seller.payoutCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {sellers?.estimatedTopSellers && sellers.estimatedTopSellers.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-3">Người Bán Hàng Top ước tính</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full table-auto border border-border rounded-md">
                      <thead className="bg-muted">
                        <tr>
                          <th className="px-4 py-3 text-left font-medium">Tên người bán</th>
                          <th className="px-4 py-3 text-left font-medium">Doanh thu ước tính</th>
                          <th className="px-4 py-3 text-left font-medium">Phí nền tảng ước tính</th>
                          <th className="px-4 py-3 text-left font-medium">Số lần thanh toán ước tính</th>
                        </tr>
                      </thead>
                      <tbody>
                        {sellers.estimatedTopSellers.map((seller, index) => (
                          <tr key={seller.sellerId} className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                            <td className="px-4 py-3 font-medium">{seller.sellerName}</td>
                            <td className="px-4 py-3">{seller.estimatedRevenue.toLocaleString()}</td>
                            <td className="px-4 py-3">{seller.estimatedPlatformFeeGenerated.toLocaleString()}</td>
                            <td className="px-4 py-3">{seller.estimatedPayoutCount}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}


              <div>
                <h3 className="text-lg font-semibold mb-3">Chỉ số Khách Hàng</h3>
                <div className="overflow-x-auto">
                  <table className="w-full table-auto border border-border rounded-md">
                    <thead className="bg-muted">
                      <tr>
                        <th className="px-4 py-3 text-left font-medium">Chỉ số</th>
                        <th className="px-4 py-3 text-left font-medium">Giá trị</th>
                      </tr>
                    </thead>
                    <tbody>
                      {customers && Object.entries(customers).map(([key, value], index) => (
                        <tr key={key} className={`border-t border-border ${index % 2 === 0 ? 'bg-background' : 'bg-muted/30'}`}>
                          <td className="px-4 py-3 font-medium">{customerMetricLabels[key] ?? key}</td>
                          <td className="px-4 py-3">{typeof value === "number" ? value.toLocaleString() : value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardFooter>
    </Card>
  );
};
