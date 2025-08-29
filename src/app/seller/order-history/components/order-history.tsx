"use client"
import { useEffect, useState } from "react";
import { Order, OrderResponse, GetOrderParams } from "@/services/product-seller/typings";
import { PaymentStatus, PaymentStatusText } from "@/const/products";
import { Input } from "@/components/ui/input";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import useGetOrderBySeller from "../hooks/useGetOrderBySeller";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationFooter } from "@/components/pagination-footer";
import { Clipboard, Eye } from "lucide-react";
import useGetOrderById from "../hooks/useGetOrderById";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { BsEye } from "react-icons/bs";

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
    const [openDetailDialog, setOpenDetailDialog] = useState(false);
    const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null);
    const [orderDetail, setOrderDetail] = useState<Order | null>(null);
    const { getOrderDetailApi, isPending: isDetailPending } = useGetOrderById();

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

    useEffect(() => {
        if (!selectedOrderId) return;
        const fetchDetail = async () => {
            const res = await getOrderDetailApi(selectedOrderId);
            if (res && res.value && res.value.data) {
                setOrderDetail(res.value.data);
            } else {
                setOrderDetail(null);
            }
        };
        fetchDetail();
    }, [selectedOrderId]);

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
                                    <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-1/2 date-icon-black dark:date-icon-white" />
                                    <span className="text-gray-500 text-sm">đến</span>
                                    <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-1/2 date-icon-black dark:date-icon-white" />
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
                                    <th className="p-3 border w-20 text-center">Xem chi tiết</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isPending ? (
                                    <tr><td colSpan={6} className="text-center p-4">Đang tải...</td></tr>
                                ) : orders.length === 0 ? (
                                    <tr><td colSpan={6} className="text-center p-4">Không có đơn hàng nào</td></tr>
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
                                                {order.shippingAddress?.fullName ?? "Chưa có thông tin"}
                                            </td>
                                            <td className="p-3 border">
                                                {(() => {
                                                    const details = order.details || [];
                                                    const totalShipFee = details.reduce((sum, detail) => {
                                                        const shipmentFees = (detail.shipments || []).reduce((shipSum, shipment) => shipSum + (shipment.totalFee || 0), 0);
                                                        return sum + shipmentFees;
                                                    }, 0);
                                                    const totalDiscount = details.reduce((sum, detail) => sum + (detail.detailDiscountPromotion || 0), 0);
                                                    const finalTotal = (order.finalAmount || 0) + totalShipFee - totalDiscount;
                                                    return finalTotal.toLocaleString("vi-VN") + "₫";
                                                })()}
                                            </td>
                                            <td className="p-3 border">
                                                {new Date(order.placedAt).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="p-3 border text-center">
                                                <Button variant="outline" size="icon" onClick={() => {
                                                    setSelectedOrderId(order.id);
                                                    setOpenDetailDialog(true);
                                                }}>
                                                    <BsEye className="w-4 h-4" />
                                                </Button>
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

            <Dialog open={openDetailDialog} onOpenChange={open => {
                setOpenDetailDialog(open);
                if (!open) {
                    setSelectedOrderId(null);
                    setOrderDetail(null);
                }
            }}>
                <DialogContent className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết đơn hàng</DialogTitle>
                    </DialogHeader>
                    {isDetailPending ? (
                        <div>Đang tải chi tiết...</div>
                    ) : orderDetail ? (
                        <div className="space-y-6 text-sm mt-2">
                            <div className="border rounded p-3 bg-white dark:bg-gray-900">
                                <div className="font-semibold mb-2">📝 Thông tin đơn</div>
                                <div>Trạng thái: <span
                                    className={`px-2 py-1 rounded text-xs font-medium
                                                        ${orderDetail.status === PaymentStatus.COMPLETED || orderDetail.status === PaymentStatus.PAID
                                            ? "bg-green-100 text-green-700"
                                            : orderDetail.status === PaymentStatus.PENDING
                                                ? "bg-yellow-100 text-yellow-700"
                                                : "bg-red-100 text-red-700"}
                                                    `}
                                >
                                    {PaymentStatusText[orderDetail.status as PaymentStatus] ?? orderDetail.status}
                                </span></div>
                                <div>Ngày đặt: {new Date(orderDetail.placedAt).toLocaleDateString("vi-VN")}</div>

                                {(() => {
                                    const allShipDates = (orderDetail.details || [])
                                        .flatMap((d: any) => (d.shipments || []).map((s: any) => s.shippedAt))
                                        .filter(Boolean)
                                        .sort();

                                    if (allShipDates.length > 0) {
                                        const lastShipped = allShipDates[allShipDates.length - 1];
                                        return (
                                            <div>
                                                Hoàn thành: {new Date(lastShipped).toLocaleDateString("vi-VN")}
                                            </div>
                                        );
                                    }
                                    return null;
                                })()}

                            </div>

                            <div className="border rounded p-3 bg-white dark:bg-gray-900">
                                <div className="font-semibold mb-2">👤 Khách hàng</div>
                                {orderDetail.shippingAddress ? (
                                    <>
                                        <div>Họ tên: {orderDetail.shippingAddress.fullName}</div>
                                        <div>Địa chỉ: {orderDetail.shippingAddress.addressLine}, {orderDetail.shippingAddress.city}, {orderDetail.shippingAddress.province}</div>
                                        <div>Điện thoại: {orderDetail.shippingAddress.phone}</div>
                                    </>
                                ) : <div>Không có thông tin</div>}
                            </div>

                            <div className="border rounded p-3 bg-white dark:bg-gray-900">
                                <div className="font-semibold mb-2">🛒 Sản phẩm đã mua</div>
                                <table className="w-full text-sm border-t border-gray-200">
                                    <thead>
                                        <tr className="text-left border-b bg-gray-100 dark:bg-gray-800">
                                            <th className="p-2">Sản phẩm</th>
                                            <th className="p-2">Tên sản phẩm</th>
                                            <th className="p-2 text-center">SL</th>
                                            <th className="p-2 text-right">Đơn giá</th>
                                            <th className="p-2 text-right">Phí ship</th>
                                            <th className="p-2 text-right">Thành tiền</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {orderDetail.details.map((item: any) => {
                                            const shipFee = (item.shipments || []).reduce((sum: number, s: any) => sum + (s.totalFee || 0), 0);
                                            const img = item.productImages?.[0] || item.blindBoxImage || "/no-image.png";
                                            return (
                                                <tr key={item.id} className="border-b">
                                                    <td className="p-2">
                                                        <img src={img} alt="product" className="w-12 h-12 object-cover rounded border" />
                                                    </td>
                                                    <td className="p-2 max-w-[80px] truncate">{item.blindBoxId && item.blindBoxName ? item.blindBoxName : item.productName}</td>
                                                    <td className="p-2 text-center">{item.quantity}</td>
                                                    <td className="p-2 text-right">{item.unitPrice?.toLocaleString("vi-VN")}₫</td>
                                                    <td className="p-2 text-right">{shipFee > 0 ? shipFee.toLocaleString("vi-VN") : 0}₫</td>
                                                    <td className="p-2 text-right">{item.totalPrice?.toLocaleString("vi-VN")}₫</td>
                                                </tr>
                                            );
                                        })}
                                    </tbody>
                                </table>
                            </div>

                            <div className="border-t pt-3 mt-3 space-y-2">
                                {(() => {
                                    const details = orderDetail.details || [];
                                    const subtotal = orderDetail.totalAmount || 0;
                                    const totalShipFee = details.reduce((sum: number, detail: any) => {
                                        const shipmentFees = (detail.shipments || []).reduce((shipSum: number, shipment: any) =>
                                            shipSum + (shipment.totalFee || 0), 0);
                                        return sum + shipmentFees;
                                    }, 0);
                                    const totalDiscount = details.reduce((sum: number, detail: any) => sum + (detail.detailDiscountPromotion || 0), 0);
                                    const finalTotal = (orderDetail.finalAmount || 0) + totalShipFee - totalDiscount;
                                    return <>
                                        <div className="flex justify-between">
                                            <span>Tạm tính:</span>
                                            <span>{subtotal.toLocaleString("vi-VN")}₫</span>
                                        </div>
                                        {totalShipFee > 0 && (
                                            <div className="flex justify-between">
                                                <span>Phí vận chuyển:</span>
                                                <span>{totalShipFee.toLocaleString("vi-VN")}₫</span>
                                            </div>
                                        )}
                                        {totalDiscount > 0 && (
                                            <div className="flex justify-between text-green-600">
                                                <span>Giảm giá:</span>
                                                <span>-{totalDiscount.toLocaleString("vi-VN")}₫</span>
                                            </div>
                                        )}
                                        <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2 space-x-2">
                                            <span>Tổng thanh toán:</span>
                                            <span className="text-red-500">{finalTotal.toLocaleString("vi-VN")}₫</span>
                                        </div>
                                    </>;
                                })()}
                            </div>
                        </div>
                    ) : (
                        <div>Không có thông tin chi tiết.</div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Đóng</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div >
    );
}
