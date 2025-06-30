"use client";

import { OrderDetail, PaymentInfo } from "@/services/order/typings";
import { PaymentInfoStatus, PaymentInfoStatusText, PaymentStatus, PaymentStatusText } from "@/const/products";
import {
    Dialog,
    DialogTrigger,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Backdrop } from "../backdrop";
import { Button } from "../ui/button";

interface ShippingAddress {
    id: string;
    fullName: string;
    phone: string;
    addressLine: string;
    city: string;
    province: string;
    postalCode: string;
    country: string;
}

interface OrderCardProps {
    orderId: string;
    shopName: string;
    details: OrderDetail[];
    total: number;
    deliveryDate: string;
    payment: PaymentInfo;
    shippingAddress?: ShippingAddress;
}

export default function OrderCard({
    orderId,
    shopName,
    details,
    total,
    deliveryDate,
    payment,
    shippingAddress,
}: OrderCardProps) {
    const router = useRouter();
    const [loadingPage, setLoadingPage] = useState(false);

    const handleViewInvoiceDetail = (id: string) => {
        setLoadingPage(true);
        router.push(`/orderhistory/${id}`);
    };
    return (
        <div className="border rounded-md shadow-sm bg-white mb-4">
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                    <div className="bg-red-600 text-white text-xs px-1 py-0.5 rounded-sm font-bold">Mall</div>
                    <div className="font-semibold truncate">{shopName}</div>
                    <button className="ml-2 text-sm px-2 py-0.5 border rounded text-red-500 border-red-500 hover:bg-red-50">
                        Chat
                    </button>
                </div>
                <div className="text-sm font-semibold text-red-500 uppercase">
                    {PaymentInfoStatusText[payment.status] || "Không xác định"}
                </div>
            </div>

            {details.map((detail) => (
                <div key={detail.id} className="p-4 flex border-b gap-4">
                    <img
                        src={
                            "blindBoxId" in detail
                                ? detail.blindBoxImage || "/placeholder.jpg"
                                : detail.productImages?.[0] || "/placeholder.jpg"
                        }
                        alt="product"
                        width={80}
                        height={80}
                        className="object-cover rounded border"
                    />
                    <div className="flex-1">
                        <div className="font-medium mb-2">
                            {"blindBoxId" in detail ? detail.blindBoxName : detail.productName}
                        </div>
                        <div className="text-sm text-gray-500">x{detail.quantity}</div>
                    </div>
                    <div className="text-right">
                        <div className="text-red-500 font-semibold">
                            {detail.unitPrice.toLocaleString()}₫
                        </div>
                    </div>
                </div>
            ))}

            <div className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center bg-gray-50 gap-4">
                <div className="text-sm text-gray-600">
                    Đơn hàng sẽ được chuẩn bị và chuyển đi trước <span className="text-blue-500 underline">{deliveryDate}</span>
                </div>

                <div className="flex flex-wrap gap-2 items-center">
                    <div className="text-sm sm:text-base text-gray-700">
                        Thành tiền:{" "}
                        <span className="text-red-500 font-semibold">
                            {total.toLocaleString()}₫
                        </span>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100">
                                Xem hóa đơn
                            </button>
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Hóa đơn đơn hàng</DialogTitle>
                                <span
                                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium uppercase w-fit
    ${payment.status === PaymentInfoStatus.Paid || payment.status === PaymentInfoStatus.Completed
                                            ? "bg-green-100 text-green-700"
                                            : "bg-red-100 text-red-700"
                                        }`}
                                >
                                    {PaymentInfoStatusText[payment.status]}
                                </span>
                            </DialogHeader>

                            <div className="space-y-6 text-sm mt-4">
                                {shippingAddress ? (
                                    <div className="border rounded p-4 bg-gray-50">
                                        <div className="font-semibold mb-2">📦 Địa chỉ nhận hàng</div>
                                        <div>
                                            {shippingAddress?.fullName ?? "Không có tên"} - {shippingAddress?.phone ?? "Không có SĐT"}
                                        </div>
                                        <div>
                                            {[shippingAddress?.postalCode, shippingAddress?.addressLine, shippingAddress?.city, shippingAddress?.province, shippingAddress?.country]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-gray-500 italic">Chưa có địa chỉ giao hàng</div>
                                )}

                                <div className="border rounded p-4 bg-white">
                                    <div className="font-semibold mb-2">🛒 Sản phẩm đã mua</div>
                                    <table className="w-full text-sm border-t border-gray-200">
                                        <thead>
                                            <tr className="text-left border-b bg-gray-100">
                                                <th className="p-2">Tên sản phẩm</th>
                                                <th className="p-2 text-center">SL</th>
                                                <th className="p-2 text-right">Đơn giá</th>
                                                <th className="p-2 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.map((item) => (
                                                <tr key={item.id} className="border-b">
                                                    <td className="p-2">
                                                        {"blindBoxId" in item ? item.blindBoxName : item.productName}
                                                    </td>
                                                    <td className="p-2 text-center">{item.quantity}</td>
                                                    <td className="p-2 text-right">{item.unitPrice.toLocaleString()}₫</td>
                                                    <td className="p-2 text-right">{(item.unitPrice * item.quantity).toLocaleString()}₫</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border rounded p-4 bg-gray-50 space-y-1">
                                    <div className="font-semibold mb-2">💳 Thông tin thanh toán</div>
                                    <div>Phương thức: <strong>{payment.method}</strong></div>
                                    <div>Mã giao dịch: <strong>{payment.transactionId}</strong></div>
                                    {payment.paidAt && (
                                        <div>Ngày thanh toán: <strong>{new Date(payment.paidAt).toLocaleDateString("vi-VN")}</strong></div>
                                    )}
                                    {payment.refundedAmount > 0 && (
                                        <div className="text-red-500">Đã hoàn tiền: <strong>{payment.refundedAmount.toLocaleString()}₫</strong></div>
                                    )}
                                </div>

                                <div className="border-t pt-4 text-right text-sm flex justify-between items-center">
                                    <div> <Button onClick={() => handleViewInvoiceDetail(orderId)}>Xem chi tiết</Button></div>
                                    <div>
                                        <div>Tạm tính: {payment.amount.toLocaleString()}₫</div>
                                        <div>Giảm giá: -{(payment.amount - payment.netAmount).toLocaleString()}₫</div>
                                        <div className="font-semibold text-base">
                                            Tổng thanh toán: <span className="text-red-500">{payment.netAmount.toLocaleString()}₫</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </DialogContent>

                    </Dialog>

                    <button className="bg-red-500 text-white px-4 py-1 rounded hover:bg-red-600">
                        Liên hệ người bán
                    </button>
                </div>
            </div>
            <Backdrop open={loadingPage} />
        </div>
    );
}
