"use client";

import React, { useEffect, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationFooter } from "@/components/pagination-footer";
import useGetInventoryOnHold from "../hooks/useGetInventoryOnHold";
import { InventoryOnHold } from "@/services/admin/typings";
import { useServiceForceReleaseHold } from "@/services/admin/services";

export default function InventoryItems() {
  const { isPending, getInventoryOnHoldApi } = useGetInventoryOnHold();
  const { mutate: forceReleaseHold, isPending: isReleasing } =
    useServiceForceReleaseHold();

  const [data, setData] = useState<InventoryOnHold[]>([]);
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

  const handleReleaseHold = (id: string) => {
    forceReleaseHold(id, {
      onSuccess: () => {
        fetchData(); // refresh danh sách sau khi release
      },
    });
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
            <h2 className="text-xl font-semibold pt-4">Vật phẩm đang giữ</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="min-w-full dark:bg-gray-900 table-fixed border border-gray-200 text-sm bg-white rounded-lg">
              <thead>
                <tr className="bg-gray-100 text-center dark:bg-gray-800">
                  <th className="p-3 border w-32">Mã vật phẩm</th>
                  <th className="p-3 border w-48">Tên vật phẩm</th>
                  <th className="p-3 border w-64">Mô tả</th>
                  <th className="p-3 border w-32">Chủ sở hữu</th>
                  <th className="p-3 border w-32">Trạng thái</th>
                  <th className="p-3 border w-24">Hành động</th>
                </tr>
              </thead>
              <tbody>
                {isPending ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      Đang tải...
                    </td>
                  </tr>
                ) : data.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center p-4">
                      <img
                        src="https://static.vecteezy.com/system/resources/previews/009/007/126/non_2x/document-file-not-found-search-no-result-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-vector.jpg"
                        alt="Danh sách trống"
                        className="mx-auto mb-2 w-24 h-24"
                      />
                      <div>Không có vật phẩm nào</div>
                    </td>
                  </tr>
                ) : (
                  data.map((item) => (
                    <tr
                      key={item.id}
                      className="hover:bg-gray-50 dark:hover:bg-opacity-80 dark:hover:text-black"
                    >
                      <td className="p-3 border text-center font-medium">
                        {item.product.id}
                      </td>
                      <td
                        className="p-3 border text-left truncate"
                        title={item.product.name}
                      >
                        <div className="font-medium">{item.product.name}</div>
                      </td>
                      <td
                        className="p-3 border text-left"
                        title={item.product.description}
                      >
                        <div className="text-sm text-gray-600 line-clamp-2">
                          {item.product.description}
                        </div>
                      </td>
                      <td
                        className="p-3 border text-center truncate"
                        title={item.product.brand}
                      >
                        {item.product.brand}
                      </td>
                      <td className="p-3 border text-center">
                        <span
                          className={`px-2 py-1 rounded text-xs font-medium ${getStatusColor(
                            item.status
                          )}`}
                          title={item.status}
                        >
                          {item.status}
                        </span>
                      </td>
                      <td className="p-3 border text-center">
                        <button
                          onClick={() => handleReleaseHold(item.id)}
                          disabled={isReleasing}
                          className="px-3 py-1 bg-red-500 hover:bg-red-600 disabled:opacity-50 text-white text-xs font-medium rounded transition-colors duration-200"
                        >
                          {isReleasing ? "Đang xử lý..." : "Giải phóng giữ"}
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
    </div>
  );
}
