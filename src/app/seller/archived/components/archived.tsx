"use client";

import React, { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PaginationFooter } from "@/components/pagination-footer";
import { SlRefresh } from "react-icons/sl";
import { CiSearch } from "react-icons/ci";
import {
  InventoryParams,
  InventoryResponse,
  InventoryItem,
} from "@/services/admin/typings";
import { InventoryItemStatus, InventoryItemStatusText } from "@/const/products";
import { useAppSelector } from "@/stores/store";
import useGetInventoryByAdmin from "@/app/admin/archived/hooks/useGetInventoryByAdmin";
import { useUpdateInventoryItemStatus } from "@/services/admin/services";

export default function Archived() {
  const { isPending, getInventoryByAdminApi } = useGetInventoryByAdmin();
  const [items, setItems] = useState<InventoryItem[]>([]);
  const userState = useAppSelector((state) => state.userSlice);
  const sellerId = userState?.user?.sellerId;
  const { mutate: updateStatus, isPending: isUpdating } = useUpdateInventoryItemStatus();
  const [paging, setPaging] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalPages: 1,
    totalItems: 0,
  });
  const [selectedStatusMap, setSelectedStatusMap] = useState<Record<string, string>>({});
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<string>("all");
  const [selectedCustomer, setSelectedCustomer] = useState<string>("all");
  const [isFromBlindBox, setIsFromBlindBox] = useState<boolean | undefined>(undefined);

  const statusBadgeClass = (s: InventoryItemStatus) => {
    switch (s) {
      case InventoryItemStatus.Available:
        return "bg-green-100 text-green-700";
      case InventoryItemStatus.Shipment_requested:
        return "bg-blue-100 text-blue-700";
      case InventoryItemStatus.Delivering:
        return "bg-yellow-100 text-yellow-700";
      case InventoryItemStatus.Listed:
        return "bg-purple-100 text-purple-700";
      case InventoryItemStatus.Archived:
        return "bg-red-100 text-red-700";
      case InventoryItemStatus.Delivered:
        return "bg-emerald-100 text-emerald-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  const fetchData = async () => {
    const params: InventoryParams = {
      pageIndex: paging.pageIndex,
      pageSize: paging.pageSize,
      search: search || undefined,
      status: status !== "all" ? status : undefined,
      isFromBlindBox: isFromBlindBox,
      sellerId: sellerId,
    };

    const res = await getInventoryByAdminApi(params);
    if (res) {
      const data = res.value?.data as InventoryResponse;
      const result: InventoryItem[] = data?.result ?? [];

      setItems(result);

      setPaging((prev) => ({
        ...prev,
        totalPages: data?.totalPages ?? prev.totalPages ?? 1,
        totalItems: data?.count ?? result.length ?? prev.totalItems ?? 0,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [paging.pageIndex, paging.pageSize, status, search, selectedCustomer, isFromBlindBox, sellerId]);

  const handleStatusChange = (itemId: string, newStatus: InventoryItemStatus) => {
    updateStatus(
      { id: itemId, status: newStatus },
      {
        onSuccess: () => {
          fetchData();
        }
      }
    );
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > paging.totalPages) return;
    setPaging((prev) => ({ ...prev, pageIndex: newPage }));
  };

  const handlePageSizeChange = (newSize: number) => {
    setPaging((prev) => ({ ...prev, pageSize: newSize, pageIndex: 1 }));
  };

  const formatDate = (s?: string | null) =>
    s ? new Date(s).toLocaleDateString("vi-VN") : "-";

  return (
    <div className="p-4">
      <Card className="shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900">
        <CardContent className="space-y-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2 className="text-xl font-semibold pt-4 text-gray-900 dark:text-gray-100">
                Kho lưu trữ
              </h2>
            </div>

            <div className="flex flex-wrap gap-4 items-center mx-auto">
              <Button
                className="bg-green-500 hover:bg-opacity-80"
                onClick={fetchData}
              >
                <SlRefresh className="mr-2" />
                Làm mới
              </Button>

              <div className="relative w-56">
                <CiSearch className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4" />
                <Input
                  placeholder="Tìm kiếm"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-8"
                />
              </div>

              <Select value={status} onValueChange={setStatus}>
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  {Object.values(InventoryItemStatus).map((i) => (
                    <SelectItem key={i} value={i}>{InventoryItemStatusText[i]}</SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select
                value={isFromBlindBox === undefined ? "all" : isFromBlindBox ? "blindbox" : "product"}
                onValueChange={(val) => {
                  if (val === "all") setIsFromBlindBox(undefined);
                  else if (val === "blindbox") setIsFromBlindBox(true);
                  else setIsFromBlindBox(false);
                }}
              >
                <SelectTrigger className="w-52">
                  <SelectValue placeholder="Loại" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả loại</SelectItem>
                  <SelectItem value="product">Sản phẩm thường</SelectItem>
                  <SelectItem value="blindbox">BlindBox</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* TABLE */}
          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border border-gray-200 dark:border-gray-700 text-sm bg-white dark:bg-gray-900 rounded-lg">
              <thead>
                <tr className="bg-gray-100 dark:bg-gray-800 text-left">
                  <th className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 w-24">Ảnh</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 w-64">Tên sản phẩm</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 w-40">Trạng thái</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 w-40">Ngày lưu trữ</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 w-60">Lý do</th>
                  <th className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200 w-60">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-600 dark:text-gray-300">
                      Đang tải...
                    </td>
                  </tr>
                ) : items.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4 text-gray-600 dark:text-gray-300">
                      <img
                        src="https://static.thenounproject.com/png/empty-box-icon-7507343-512.png"
                        alt="Empty"
                        className="mx-auto mb-2 w-24 h-24 opacity-50"
                      />
                      <div>Không có dữ liệu</div>
                    </td>
                  </tr>
                ) : (
                  items.map((it) => (
                    <tr key={it.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 border-b border-gray-200 dark:border-gray-700">
                      <td className="p-3 border border-gray-200 dark:border-gray-700 text-center">
                        <img
                          src={it.image || it.product.imageUrls?.[0]}
                          alt={it.product.name}
                          className="w-16 h-16 object-cover rounded-md mx-auto"
                        />
                      </td>
                      <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200">{it.product.name}</td>
                      <td className="p-3 border border-gray-200 dark:border-gray-700">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${statusBadgeClass(
                            it.status as InventoryItemStatus
                          )}`}
                          title={it.status}
                        >
                          {InventoryItemStatusText[it.status as InventoryItemStatus] ??
                            it.status}
                        </span>
                      </td>
                      <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200">{formatDate(it.archivedAt)}</td>
                      <td className="p-3 border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-gray-200">
                        {it.archivedReason || "-"}
                      </td>
                      <td className="p-3 border border-gray-200 dark:border-gray-700 w-60">
                        {it.status === InventoryItemStatus.Archived ? (
                          <div className="space-y-2">
                            <Select
                              value={selectedStatusMap[it.id] || "placeholder"} // ← Sử dụng ở đây
                              onValueChange={(value) => {
                                if (value !== "placeholder") {
                                  setSelectedStatusMap(prev => ({ ...prev, [it.id]: value }));
                                  handleStatusChange(it.id, value as InventoryItemStatus);
                                }
                              }}
                              disabled={isUpdating}
                            >
                              <SelectTrigger className="w-full">
                                <SelectValue placeholder="Chọn trạng thái mới" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="placeholder" disabled>
                                  Chọn trạng thái mới
                                </SelectItem>
                                {Object.values(InventoryItemStatus)
                                  .filter(status => status !== InventoryItemStatus.Archived)
                                  .map((status) => (
                                    <SelectItem key={status} value={status}>
                                      {InventoryItemStatusText[status]}
                                    </SelectItem>
                                  ))}
                              </SelectContent>
                            </Select>
                            {isUpdating && (
                              <div className="text-blue-500 text-xs">Đang cập nhật trạng thái...</div>
                            )}
                          </div>
                        ) : (
                          <div className="text-center">
                            <span className="text-gray-400 dark:text-gray-500 text-sm">
                              Chỉ có thể thay đổi khi đã lưu trữ
                            </span>
                          </div>
                        )}
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
    </div >
  );
}
