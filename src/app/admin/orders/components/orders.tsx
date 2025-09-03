"use client"
import { useEffect, useState } from "react";
import { PaymentStatus, PaymentStatusText } from "@/const/products";
import { Input } from "@/components/ui/input";
import { useAdminSellerList } from "../hooks/useAdminSellerList";
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { PaginationFooter } from "@/components/pagination-footer";
import { Clipboard, Eye } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogClose, DialogFooter } from "@/components/ui/dialog";
import useGetOrderByAdmin from "../hooks/useGetOrderByAdmin";
import { GetOrderParams, Order, OrderResponse } from "@/services/admin/typings";
import { Button } from "@/components/ui/button";
import useAdminCompleteShipment from "../hooks/useAdminCompleteShipment";
import { StatusSeller, StatusSellerText } from "@/const/seller";
import { SlRefresh } from "react-icons/sl";

export default function Orders() {
    const completeShipmentMutation = useAdminCompleteShipment();
    const [openCustomerDialog, setOpenCustomerDialog] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState<any>(null);
    const [openAmountDialog, setOpenAmountDialog] = useState(false);
    const [selectedOrderAmount, setSelectedOrderAmount] = useState<any>(null);
    const [openSellerDialog, setOpenSellerDialog] = useState(false);
    const [selectedSeller, setSelectedSeller] = useState<any>(null);
    const { isPending, getOrderByAdminApi } = useGetOrderByAdmin();
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
    const [sellerId, setSellerId] = useState("all");
    const { data: sellers = [], isLoading: isLoadingSellers } = useAdminSellerList(1, 50);

    const toISODate = (d: string, isEnd = false) => {
        if (!d) return "";
        return isEnd ? new Date(d + 'T23:59:59').toISOString() : new Date(d + 'T00:00:00').toISOString();
    };

    const fetchData = async () => {
        const params: GetOrderParams = {
            pageIndex: paging.pageIndex,
            pageSize: paging.pageSize,
            status: status !== "all" ? (status as PaymentStatus) : undefined,
            placedFrom: toISODate(dateFrom),
            placedTo: toISODate(dateTo, true),
            SellerId: sellerId !== "all" ? sellerId : undefined,
        };
        const res = await getOrderByAdminApi(params);
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
    useEffect(() => {
        fetchData();
    }, [paging.pageIndex, paging.pageSize, status, dateFrom, dateTo, sellerId]);

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
                                <Button className='bg-green-500 hover:bg-opacity-80' onClick={fetchData}><SlRefresh />Làm mới</Button>
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
                                    <Input type="date" value={dateFrom} onChange={e => setDateFrom(e.target.value)} className="w-36" />
                                    <span className="text-gray-500 text-sm">đến</span>
                                    <Input type="date" value={dateTo} onChange={e => setDateTo(e.target.value)} className="w-36" />
                                </div>
                                <Select value={sellerId} onValueChange={setSellerId}>
                                    <SelectTrigger className="w-48">
                                        <SelectValue placeholder="Chọn seller" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="all">Tất cả người bán</SelectItem>
                                        {sellers.map(s => (
                                            <SelectItem key={s.id} value={s.id}>
                                                {s.fullName || s.email || s.companyName}
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
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
                                    <th className="p-3 border w-40">Người bán</th>
                                    <th className="p-3 border w-32">Tổng tiền</th>
                                    <th className="p-3 border w-32">Ngày đặt</th>
                                    <th className="p-3 border w-32">Hành động</th>
                                </tr>
                            </thead>
                            <tbody>
                                {isPending ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-4">
                                            Đang tải...
                                        </td>
                                    </tr>
                                ) : orders.length === 0 ? (
                                    <tr>
                                        <td colSpan={7} className="text-center p-4">
                                            <img
                                                src="https://static.thenounproject.com/png/empty-box-icon-7507343-512.png"
                                                alt="Lịch sử trống"
                                                className="mx-auto mb-2 w-24 h-24"
                                            />
                                            <div>Không có đơn hàng nào</div>
                                        </td>
                                    </tr>
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
                                                <div className="flex items-center justify-between gap-2">
                                                    {order.user?.fullName ?? "Chưa có thông tin"}
                                                    {order.user && (
                                                        <button
                                                            type="button"
                                                            className="hover:text-[#d02a2a]"
                                                            onClick={() => {
                                                                setSelectedCustomer(order.user);
                                                                setOpenCustomerDialog(true);
                                                            }}
                                                            title="Xem chi tiết khách hàng"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>

                                            <td className="p-3 border">
                                                <div className="flex items-center justify-between gap-2">
                                                    {order.seller?.fullName || "-"}
                                                    {order.seller && (
                                                        <button
                                                            type="button"
                                                            className="hover:text-[#d02a2a]"
                                                            onClick={() => {
                                                                setSelectedSeller(order.seller);
                                                                setOpenSellerDialog(true);
                                                            }}
                                                            title="Xem chi tiết người bán"
                                                        >
                                                            <Eye size={16} />
                                                        </button>
                                                    )}
                                                </div>
                                            </td>
                                            <td className="p-3 border">
                                                <div className="flex items-center justify-between gap-2">
                                                    {(() => {
                                                        const details = order.details || [];
                                                        const totalShipFee = details.reduce((sum: number, detail: any) => {
                                                            const shipmentFees = (detail.shipments || []).reduce((shipSum: number, shipment: any) =>
                                                                shipSum + (shipment.totalFee || 0), 0);
                                                            return sum + shipmentFees;
                                                        }, 0);
                                                        const totalDiscount = details.reduce((sum: number, detail: any) => sum + (detail.detailDiscountPromotion || 0), 0);
                                                        const finalTotal = (order.finalAmount || 0) + totalShipFee - totalDiscount;
                                                        return finalTotal.toLocaleString("vi-VN") + "₫";
                                                    })()}
                                                    <button
                                                        type="button"
                                                        className="hover:text-[#d02a2a]"
                                                        onClick={() => {
                                                            setSelectedOrderAmount(order);
                                                            setOpenAmountDialog(true);
                                                        }}
                                                        title="Xem chi tiết tổng tiền"
                                                    >
                                                        <Eye size={16} />
                                                    </button>
                                                </div>
                                            </td>
                                            <td className="p-3 border">
                                                {new Date(order.placedAt).toLocaleDateString("vi-VN")}
                                            </td>
                                            <td className="p-3 border">
                                                {order.details?.map((detail: any) =>
                                                    detail.status === "DELIVERING" && detail.shipments?.map((shipment: any) => (
                                                        <Button
                                                            key={shipment.id}
                                                            size="sm"
                                                            variant="outline"
                                                            disabled={completeShipmentMutation.isPending}
                                                            onClick={() => completeShipmentMutation.mutate(
                                                                { shipmentId: shipment.id },
                                                                { onSuccess: fetchData }
                                                            )}
                                                        >
                                                            Hoàn thành
                                                        </Button>
                                                    ))
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

            <Dialog open={openSellerDialog} onOpenChange={setOpenSellerDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết người bán</DialogTitle>
                    </DialogHeader>
                    {selectedSeller ? (
                        <div className="space-y-2">
                            <div><b>Thương hiệu:</b> {selectedSeller.fullName || "-"}</div>
                            <div><b>Email:</b> {selectedSeller.email || "-"}</div>
                            <div><b>Công ty:</b> {selectedSeller.companyName || "-"}</div>
                            <div><b>Số điện thoại:</b> {selectedSeller.phoneNumber || "-"}</div>
                            <div>
                                <b>Trạng thái:</b>
                                {selectedSeller.sellerStatus
                                    ? StatusSellerText[selectedSeller.sellerStatus as StatusSeller]
                                    : "-"}
                            </div>
                            <div><b>Địa chỉ:</b> {selectedSeller.companyAddress || "-"}</div>
                        </div>
                    ) : (
                        <div>Không có thông tin người bán.</div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Đóng</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={openCustomerDialog} onOpenChange={setOpenCustomerDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Chi tiết khách hàng</DialogTitle>
                    </DialogHeader>

                    {selectedCustomer ? (
                        <div className="space-y-2">
                            <div>
                                <b>Họ tên:</b> {selectedCustomer.fullName || "-"}
                            </div>
                            <div>
                                <b>Email:</b> {selectedCustomer.email || "-"}
                            </div>
                            <div>
                                <b>Số điện thoại:</b> {selectedCustomer.phoneNumber || "Chưa có"}
                            </div>
                        </div>
                    ) : (
                        <div>Không có thông tin khách hàng.</div>
                    )}

                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Đóng</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={openAmountDialog} onOpenChange={setOpenAmountDialog}>
                <DialogContent className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>Chi tiết tổng tiền</DialogTitle>
                    </DialogHeader>
                    {selectedOrderAmount ? (() => {
                        const details = selectedOrderAmount.details || [];
                        const subtotal = selectedOrderAmount.totalAmount || 0;
                        const totalShipFee = details.reduce((sum: number, detail: any) => {
                            const shipmentFees = (detail.shipments || []).reduce((shipSum: number, shipment: any) =>
                                shipSum + (shipment.totalFee || 0), 0);
                            return sum + shipmentFees;
                        }, 0);
                        const totalDiscount = details.reduce((sum: number, detail: any) => sum + (detail.detailDiscountPromotion || 0), 0);
                        const finalTotal = (selectedOrderAmount.finalAmount || 0) + totalShipFee - totalDiscount;
                        return (
                            <div className="space-y-6 text-sm mt-2">
                                <div className="border rounded p-4 bg-white">
                                    <div className="font-semibold mb-2">🛒 Sản phẩm đã mua</div>
                                    <table className="w-full text-sm border-t border-gray-200">
                                        <thead>
                                            <tr className="text-left border-b bg-gray-100">
                                                <th className="p-2">Sản phẩm</th>
                                                <th className="p-2">Tên sản phẩm</th>
                                                <th className="p-2 text-center">SL</th>
                                                <th className="p-2 text-right">Đơn giá</th>
                                                <th className="p-2 text-right">Phí ship</th>
                                                <th className="p-2 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.map((item: any) => {
                                                const shipFee = (item.shipments || []).reduce((sum: number, s: any) => sum + (s.totalFee || 0), 0);
                                                const img = item.productImages?.[0] || item.blindBoxImage || "/no-image.png";
                                                return (
                                                    <tr key={item.id} className="border-b">
                                                        <td className="p-2">
                                                            <img src={img} alt="product" className="w-12 h-12 object-cover rounded border" />
                                                        </td>
                                                        <td className="p-2">{item.blindBoxId && item.blindBoxName ? item.blindBoxName : item.productName}</td>
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
                                </div>
                            </div>
                        );
                    })() : (
                        <div>Không có thông tin chi tiết.</div>
                    )}
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button>Đóng</Button>
                        </DialogClose>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
