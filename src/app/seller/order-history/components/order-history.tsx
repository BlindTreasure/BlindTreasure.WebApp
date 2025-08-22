"use client"
import { useEffect, useState } from "react";
import { Order, OrderResponse, GetOrderParams } from "@/services/product-seller/typings";
import { PaymentStatus, PaymentStatusText } from "@/const/products";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import useGetOrderBySeller from "../hooks/useGetOrderBySeller";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationFooter } from "@/components/pagination-footer";
import { Clipboard } from "lucide-react";

export default function OrderHistory() {
    const { isPending, getOrderBySellerApi } = useGetOrderBySeller();
    const [orders, setOrders] = useState<Order[]>([]);
    const [paging, setPaging] = useState({
        pageIndex: 1,
        pageSize: 5,
        totalPages: 1,
        totalItems: 0,
    });
    const [status, setStatus] = useState<string>("all");
    const [dateFrom, setDateFrom] = useState("");
    const [dateTo, setDateTo] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            const toISODate = (d: string, isEnd = false) => {
                if (!d) return undefined;
                return isEnd ? new Date(d + 'T23:59:59').toISOString() : new Date(d + 'T00:00:00').toISOString();
            };
            const params: GetOrderParams = {
                pageIndex: paging.pageIndex,
                pageSize: paging.pageSize,
                status: status !== "all" ? (status as PaymentStatus) : undefined,
                placedFrom: toISODate(dateFrom),
                placedTo: toISODate(dateTo, true),
            };
            const res = await getOrderBySellerApi(params);
            if (res) {
                const data: OrderResponse = res.value.data;
                setOrders(data.result);
                setPaging((prev) => ({
                    ...prev,
                    totalPages: data.totalPages,
                    totalItems: data.count,
                }));
            }
        };
        fetchData();
    }, [paging.pageIndex, paging.pageSize, status, dateFrom, dateTo]);

    const handlePageChange = (newPage: number) => {
        if (newPage < 1 || newPage > paging.totalPages) return;
        setPaging((prev) => ({ ...prev, pageIndex: newPage }));
    };

    const handlePageSizeChange = (newSize: number) => {
        setPaging((prev) => ({ ...prev, pageSize: newSize, pageIndex: 1 }));
    };

    return (
        <div className="p-4">
            <Card className="shadow-lg rounded-lg border border-gray-200">
                <CardContent className="space-y-6">
                    <div className="flex justify-between items-center">
                        <h2 className="text-xl font-semibold mb-4 pt-4">Lịch sử đơn hàng</h2>
                        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                            <div className="flex flex-wrap gap-4 items-center">
                                <Select value={status} onValueChange={setStatus}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Trạng thái thanh toán" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả trạng thái</SelectItem>
                                        {Object.values(PaymentStatus).map((s) => (
                                            <SelectItem key={s} value={s}>{PaymentStatusText[s]}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <div className="flex gap-2 items-center">
                                    <span className="text-gray-500 text-sm">Từ</span>
                                    <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)}  className="w-1/2 date-icon-black dark:date-icon-white" />
                                    <span className="text-gray-500 text-sm">đến</span>
                                    <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)}  className="w-1/2 date-icon-black dark:date-icon-white" />
                                </div>
                            </div>
                        </div>
                    </div>
                    {/* TABLE */}
                    <div className="overflow-x-auto">
                        <table className="min-w-full dark:bg-gray-900 table-fixed border border-gray-200 text-sm bg-white rounded-lg">
                            <thead>
                                <tr className="bg-gray-100 text-left dark:bg-gray-800">
                                    <th className="p-3 border w-32">Mã đơn</th>
                                    <th className="p-3 border w-32">Trạng thái</th>
                                    <th className="p-3 border w-40">Khách hàng</th>
                                    <th className="p-3 border w-32">Tổng tiền</th>
                                    <th className="p-3 border w-32">Ngày đặt</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isPending ? (
                                    <tr><td colSpan={5} className="text-center p-4">Đang tải...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan={5} className="text-center p-4">Không có đơn hàng nào</td></tr>
                                ) : (
                                    orders.map((order: Order) => (
                                        <tr key={order.id} className="hover:bg-gray-50 dark:hover:bg-opacity-80 dark:hover:text-black">
                                            <td className="p-3 border font-mono"><div
                                                className="flex items-center gap-2 cursor-pointer group"
                                                onClick={() => navigator.clipboard.writeText(order.id)}
                                            >
                                                <span>#{order.id.substring(0, 8).toUpperCase()}...</span>
                                                <Clipboard size={14} className="text-gray-400 group-hover:text-gray-600 dark:hover:text-black" />
                                            </div></td>
                                            <td className="p-3 border">
                                                <span
                                                    className={`px-2 py-1 rounded text-xs font-medium
                                                        ${order.status === PaymentStatus.COMPLETED || order.status === PaymentStatus.PAID
                                                            ? "bg-green-100 text-green-700"
                                                            : order.status === PaymentStatus.PENDING
                                                                ? "bg-yellow-100 text-yellow-700"
                                                                : "bg-red-100 text-red-700"}
                                                    `}
                                                >
                                                    {PaymentStatusText[order.status as PaymentStatus] ?? order.status}
                                                </span>
                                            </td>
                                            <td className="p-3 border">
                                                {order.shippingAddress?.fullName ?? "Chưa có địa chỉ"}
                                            </td>
                                            <td className="p-3 border">
                                                {order.finalAmount.toLocaleString("vi-VN")}₫
                                            </td>
                                            <td className="p-3 border">
                                                {new Date(order.placedAt).toLocaleDateString("vi-VN")}
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
