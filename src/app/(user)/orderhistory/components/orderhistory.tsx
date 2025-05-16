"use client";

import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import PaginationBar from "@/components/pagination";

// Fake data
const fakeOrders = [
  {
    id: "ORD12345",
    date: new Date("2025-05-10"),
    totalItems: 5,
    boxTypes: 3,
    totalPrice: 500000,
    status: "processing",
  },
  {
    id: "ORD12346",
    date: new Date("2025-05-12"),
    totalItems: 2,
    boxTypes: 1,
    totalPrice: 200000,
    status: "shipped",
  },
  {
    id: "ORD12347",
    date: new Date("2025-05-14"),
    totalItems: 4,
    boxTypes: 2,
    totalPrice: 350000,
    status: "completed",
  },
  {
    id: "ORD12348",
    date: new Date("2025-05-15"),
    totalItems: 1,
    boxTypes: 1,
    totalPrice: 100000,
    status: "cancelled",
  },
];

const tabOptions = [
  { key: "all", label: "Tất cả" },
  { key: "processing", label: "Đang xử lý" },
  { key: "shipped", label: "Đang giao" },
  { key: "completed", label: "Hoàn thành" },
  { key: "cancelled", label: "Đã hủy" },
];

export default function OrderHistory() {
  const [activeTab, setActiveTab] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const limit = 2;

  const filteredOrders =
    activeTab === "all"
      ? fakeOrders
      : fakeOrders.filter((order) => order.status === activeTab);

  const totalPages = Math.ceil(filteredOrders.length / limit);
  const startIndex = (currentPage - 1) * limit;
  const paginatedOrders = filteredOrders.slice(startIndex, startIndex + limit);

  const getCount = (key: string) => {
    return key === "all"
      ? fakeOrders.length
      : fakeOrders.filter((order) => order.status === key).length;
  };

  const handleTabChange = (tabKey: string) => {
    setActiveTab(tabKey);
    setCurrentPage(1); // Reset về trang 1 khi đổi tab
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 py-20">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">Lịch sử đơn hàng</h1>

      {/* Tabs */}
      <div className="flex flex-wrap gap-3 mb-6 border-b pb-2 overflow-x-auto">
        {tabOptions.map((tab) => (
          <button
            key={tab.key}
            className={`relative px-3 py-1 text-sm font-medium transition ${
              activeTab === tab.key
                ? "text-red-600 border-b-2 border-red-600"
                : "text-muted-foreground"
            }`}
            onClick={() => handleTabChange(tab.key)}
          >
            {tab.label}
            {getCount(tab.key) > 0 && (
              <Badge className="ml-2 bg-red-500 text-white rounded-full px-2 py-0 text-xs">
                {getCount(tab.key)}
              </Badge>
            )}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Ngày đặt</th>
              <th className="px-4 py-3">Loại box</th>
              <th className="px-4 py-3">Số lượng</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {paginatedOrders.length > 0 ? (
              paginatedOrders.map((order, idx) => (
                <tr key={order.id} className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                  <td className="px-4 py-4 font-medium text-primary">#{order.id}</td>
                  <td className="px-4 py-4 flex items-center gap-1 text-muted-foreground">
                    <CalendarDays className="w-4 h-4 shrink-0" />
                    {format(order.date, "dd/MM/yyyy")}
                  </td>
                  <td className="px-4 py-4">{order.boxTypes}</td>
                  <td className="px-4 py-4">{order.totalItems}</td>
                  <td className="px-4 py-4 text-green-600 font-medium">
                    {order.totalPrice.toLocaleString("vi-VN")}₫
                  </td>
                  <td className="px-4 py-4 text-center">
                    <Link href={`/orderhistory/${order.id}`}>
                      <Button variant="outline" size="sm">
                        Xem chi tiết
                      </Button>
                    </Link>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="text-center py-6 text-muted-foreground">
                  Không có đơn hàng nào.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <PaginationBar
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}
    </div>
  );
}
