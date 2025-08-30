"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationFooter } from "@/components/pagination-footer";
import useGetInventoryOnHold from "../hooks/useGetInventoryOnHold";
import { InventoryOnHold } from "@/services/admin/typings";
import { useServiceForceReleaseHold } from "@/services/admin/services";
import { ConfirmDialog } from "./confirm-dialog";

export default function InventoryItems() {
  const { isPending, getInventoryOnHoldApi } = useGetInventoryOnHold();
  const { mutate: forceReleaseHold, isPending: isReleasing } =
    useServiceForceReleaseHold();

  const [data, setData] = useState<InventoryOnHold[]>([]);
  const [selectedItem, setSelectedItem] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [paging, setPaging] = useState({
    pageIndex: 1,
    pageSize: 5,
    totalPages: 0,
    totalItems: 0,
  });

  const fetchData = async () => {
    const res = await getInventoryOnHoldApi({
      pageIndex: paging.pageIndex,
      pageSize: paging.pageSize,
    });

    if (res && res.value?.data) {
      const result = res.value.data.result || [];
      setData(result);
      setPaging((prev) => ({
        ...prev,
        totalPages: res.value.data.totalPages,
        totalItems: res.value.data.count,
      }));
    } else {
      setData([]);
      setPaging((prev) => ({
        ...prev,
        totalPages: 0,
        totalItems: 0,
      }));
    }
  };

  useEffect(() => {
    fetchData();
  }, [paging.pageIndex, paging.pageSize]);

  const handlePageChange = (page: number) => {
    setPaging((prev) => ({ ...prev, pageIndex: page }));
  };

  const handlePageSizeChange = (size: number) => {
    setPaging((prev) => ({ ...prev, pageSize: size, pageIndex: 1 }));
  };

  const handleOpenDialog = (id: string) => {
    setSelectedItem(id);
    setIsDialogOpen(true);
  };

  const handleConfirmRelease = () => {
    if (selectedItem) {
      forceReleaseHold(selectedItem, {
        onSuccess: () => {
          setIsDialogOpen(false);
          setSelectedItem(null);
          fetchData(); // refresh danh sách sau khi release
        },
      });
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "available":
        return "bg-green-100 text-green-700";
      case "in use":
        return "bg-blue-100 text-blue-700";
      case "locked":
        return "bg-yellow-100 text-yellow-700";
      case "damaged":
        return "bg-red-100 text-red-700";
      case "sold":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="p-4">
      <Card className="shadow-lg rounded-lg border border-gray-200">
        <CardContent className="space-y-6 p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold pt-4">Danh sách vật phẩm đang được Tạm giữ</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full table-fixed border border-gray-200 text-sm bg-white rounded-lg overflow-hidden">
              <thead>
                <tr className="bg-gray-100 text-center">
                  <th className="p-3 border w-[15%]">Mã vật phẩm</th>
                  <th className="p-3 border w-[25%]">Thông tin vật phẩm</th>
                  <th className="p-3 border w-[20%]">Thông tin giữ</th>
                  <th className="p-3 border w-[15%]">Khu vực</th>
                  <th className="p-3 border w-[15%]">Trạng thái</th>
                  <th className="p-3 border w-[10%]">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {isPending ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      <div className="flex items-center justify-center space-x-2">
                        <div className="w-4 h-4 border-2 border-blue-500 rounded-full animate-spin border-t-transparent"></div>
                        <span className="text-gray-500">Đang tải...</span>
                      </div>
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-8">
                      <div className="flex flex-col items-center justify-center gap-3">
                        <img
                          src="https://static.vecteezy.com/system/resources/previews/009/007/126/non_2x/document-file-not-found-search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                          alt="Danh sách trống"
                          className="w-32 h-32 object-contain"
                        />
                        <span className="text-gray-500">Hiện không có vật phẩm nào đang ở trạng thái Tạm giữ</span>
                      </div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                      <td className="p-3 border">
                        <div className="text-center">
                          <div className="font-medium text-gray-900">{item.product.id.substring(0, 8)}...</div>
                          <div className="text-xs text-gray-500 mt-1">
                            ID: {item.id.substring(0, 8)}...
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 min-w-0">
                            <div className="font-medium text-gray-900 truncate" title={item.product.name}>
                              {item.product.name}
                            </div>
                            <div className="text-xs text-gray-500 mt-1">
                              <span className="bg-purple-100 text-purple-700 px-2 py-0.5 rounded-full text-xs font-medium">
                                {item.product.brand}
                              </span>
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="text-center">
                          {item.holdInfo && (
                            <>
                              <div className="text-sm text-gray-900">
                                Còn {Math.ceil(item.holdInfo.remainingDays)} ngày Tạm giữ
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Ngày hết hạn Tạm giữ: {new Date(item.holdInfo.holdUntil).toLocaleDateString('vi-VN')}
                              </div>
                            </>
                          )}
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="text-center font-medium text-gray-600">
                          Hồ Chí Minh
                        </div>
                      </td>
                      <td className="p-3 border">
                        <div className="flex flex-col items-center gap-1">
                          <span
                            className={`px-2.5 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              item.status
                            )}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </td>
                      <td className="p-3 border">
                        <button
                          onClick={() => handleOpenDialog(item.id)}
                          disabled={isReleasing}
                          className="w-full px-3 py-1.5 bg-red-500 hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed text-white text-xs font-medium rounded-md transition-all duration-200 shadow-sm hover:shadow focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-opacity-50"
                        >
                            {isReleasing ? (
                            <div className="flex items-center justify-center gap-1">
                              <div className="w-3 h-3 border-2 border-white rounded-full animate-spin border-t-transparent"></div>
                              <span>Đang cập nhật...</span>
                            </div>
                          ) : (
                            "Giải phóng giữ"
                          )}
                        </button>
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

      <ConfirmDialog
        isOpen={isDialogOpen}
        onClose={() => {
          setIsDialogOpen(false);
          setSelectedItem(null);
        }}
        onConfirm={handleConfirmRelease}
        isLoading={isReleasing}
      />
    </div>
  );
}
