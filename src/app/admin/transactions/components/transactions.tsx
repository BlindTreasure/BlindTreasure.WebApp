"use client";

import React, { useEffect, useState } from "react";
import {
  StripeTransaction,
  StripeTransactionResponse,
  TransactionsParams,
} from "@/services/admin/typings";
import useGetTransactionByAdmin from "../hooks/useGetTransactions";
import { PaginationFooter } from "@/components/pagination-footer";
import { Card, CardContent } from "@/components/ui/card";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAdminSellerList } from "@/app/admin/orders/hooks/useAdminSellerList";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";

export default function Transactions() {
  const { isPending, getTransactionByAdminApi } = useGetTransactionByAdmin();
  const [data, setData] = useState<StripeTransaction[]>([]);

  const [paging, setPaging] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalPages: 0,
    totalItems: 0,
  });

  const [filters, setFilters] = useState<TransactionsParams>({
    pageIndex: paging.pageIndex,
    pageSize: paging.pageSize,
  });

  const { data: sellers = [], isLoading: isLoadingSellers } = useAdminSellerList(
    1,
    50
  ); 

  const toISODate = (d: string, isEnd = false) => {
    if (!d) return undefined;
    const date = new Date(d);
    if (isEnd) {
      date.setHours(23, 59, 59, 999);
    } else {
      date.setHours(0, 0, 0, 0);
    }
    return date.toISOString();
  };

  const fetchData = async () => {
    const params: TransactionsParams = {
      ...filters,
      pageIndex: paging.pageIndex,
      pageSize: paging.pageSize,
      transferredFrom: filters.transferredFrom
        ? toISODate(filters.transferredFrom)
        : undefined,
      transferredTo: filters.transferredTo
        ? toISODate(filters.transferredTo, true)
        : undefined,
    };
    const res = await getTransactionByAdminApi(params);

    if (res && res.value && res.value.data) {
      const response = res.value.data as StripeTransactionResponse;
      setData(response.result);
      setPaging((prev) => ({
        ...prev,
        totalPages: response.totalPages,
        totalItems: response.count,
      }));
    } else {
      setData([]);
      setPaging({
        pageIndex: 1,
        pageSize: 10,
        totalPages: 0,
        totalItems: 0,
      });
    }
  };

  useEffect(() => {
    fetchData();
  }, [filters, paging.pageIndex, paging.pageSize]);

  const handleFilterChange = (
    name: keyof TransactionsParams,
    value: any
  ) => {
    setPaging({ ...paging, pageIndex: 1 });
    setFilters((prev) => ({
      ...prev,
      [name]: value === "all" || value === "" ? undefined : value,
    }));
  };

  const handlePageChange = (page: number) => {
    setPaging((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPaging((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  return (
    <div className="p-4">
      <Card className="shadow-lg rounded-lg border border-gray-200">
        <CardContent className="space-y-6 p-4">
          <h2 className="text-xl font-semibold pt-4">Lịch sử giao dịch</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Select
              value={filters.sellerId || "all"}
              onValueChange={(value) => handleFilterChange("sellerId", value)}
              disabled={isLoadingSellers}
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn người bán" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả người bán</SelectItem>
                {sellers.map((s) => (
                  <SelectItem key={s.id} value={s.id}>
                    {s.companyName || s.fullName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <div className="flex items-center gap-2">
              <Input
                type="date"
                value={filters.transferredFrom?.split("T")[0] || ""}
                onChange={(e) =>
                  handleFilterChange("transferredFrom", e.target.value)
                }
                className="w-full"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="date"
                value={filters.transferredTo?.split("T")[0] || ""}
                onChange={(e) =>
                  handleFilterChange("transferredTo", e.target.value)
                }
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="Số tiền tối thiểu"
                value={filters.minAmount || ""}
                onChange={(e) =>
                  handleFilterChange("minAmount", e.target.valueAsNumber)
                }
                className="w-full"
              />
              <span className="text-gray-500">-</span>
              <Input
                type="number"
                placeholder="Số tiền tối đa"
                value={filters.maxAmount || ""}
                onChange={(e) =>
                  handleFilterChange("maxAmount", e.target.valueAsNumber)
                }
                className="w-full"
              />
            </div>

            <div className="flex items-center gap-2">
              <Checkbox
                id="isInitiatedBySystem"
                checked={filters.isInitiatedBySystem}
                onCheckedChange={(checked) =>
                  handleFilterChange("isInitiatedBySystem", checked)
                }
              />
              <Label htmlFor="isInitiatedBySystem">Hệ thống tự động</Label>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full dark:bg-gray-900 table-fixed border border-gray-200 text-sm bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-center dark:bg-gray-800">
                  <th className="p-3 border w-32">Người bán</th>
                  <th className="p-3 border w-40">Mã giao dịch Stripe</th>
                  <th className="p-3 border w-32">Tài khoản Stripe</th>
                  <th className="p-3 border w-24">Số tiền</th>
                  <th className="p-3 border w-24">Trạng thái</th>
                  <th className="p-3 border w-32">Ngày chuyển</th>
                  <th className="p-3 border w-32">Người khởi tạo</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4">
                      Đang tải...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center p-4">
                      <img
                        src="/images/no-order.jpg"
                        alt="Không có giao dịch"
                        className="mx-auto mb-2 w-24 h-24"
                      />
                      <div>Không có giao dịch nào</div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.stripeTransferId}
                      className="hover:bg-gray-50 dark:hover:bg-opacity-80"
                    >
                      <td
                        className="p-3 border text-center truncate"
                        title={item.sellerName}
                      >
                        {item.sellerName}
                      </td>
                      <td
                        className="p-3 border text-center truncate"
                        title={item.stripeTransferId}
                      >
                        {item.stripeTransferId}
                      </td>
                      <td
                        className="p-3 border text-center truncate"
                        title={item.stripeDestinationAccount}
                      >
                        {item.stripeDestinationAccount}
                      </td>
                      <td className="p-3 border text-center">
                        {item.payout.netAmount.toLocaleString("vi-VN")}₫
                      </td>
                      <td className="p-3 border text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${
                            item.status.toLowerCase() === "paid"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        {new Date(item.transferredAt).toLocaleDateString(
                          "vi-VN"
                        )}
                      </td>
                      <td className="p-3 border text-center">
                        {item.initiatedByName}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          <PaginationFooter
            currentPage={paging.pageIndex}
            totalPages={paging.totalPages}
            totalItems={paging.totalItems}
            pageSize={paging.pageSize}
            onPageSizeChange={handlePageSizeChange}
            onPageChange={handlePageChange}
          />
        </CardContent>
      </Card>
    </div>
  );
}