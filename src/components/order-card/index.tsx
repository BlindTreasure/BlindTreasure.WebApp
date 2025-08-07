"use client";

import { OrderDetail, PaymentInfo } from "@/services/order/typings";
import { OrderStatus, OrderStatusText, PaymentInfoStatus, PaymentInfoStatusText } from "@/const/products";
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
import WriteReview from "../product-reviews/write-review";
import useCreateReview from "@/app/(user)/purchased/hooks/useCreateReview";

// Helper function to determine actual status from logs
const getActualStatusFromLogs = (logs: string, currentStatus: OrderStatus): OrderStatus => {
    if (!logs) return currentStatus;

    const logLines = logs.split('\n');

    // Check for delivery completion first
    const hasDelivered = logLines.some(line =>
        line.includes('Delivered') ||
        line.includes('delivered')
    );

    // Check for actual delivering status (item is being shipped)
    const hasDelivering = logLines.some(line =>
        line.includes('Delivering')
    );

    // Check for shipping request
    const hasShipmentRequest = logLines.some(line =>
        line.includes('Shipment requested by user') ||
        line.includes('requested shipment')
    );

    if (hasDelivered) {
        return OrderStatus.DELIVERED;
    } else if (hasDelivering) {
        return OrderStatus.DELIVEREDING;
    } else if (hasShipmentRequest) {
        return OrderStatus.SHIPPING_REQUESTED;
    }
    if (currentStatus === OrderStatus.DELIVEREDING && !hasDelivering && !hasShipmentRequest) {
        return OrderStatus.PENDING;
    }

    return currentStatus;
};

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
    payment?: PaymentInfo | null;
    finalAmount?: number;
    shippingAddress?: ShippingAddress;
    totalShippingFee?: number;
    onReviewCreated?: (reviewData: any) => void;
}

export default function OrderCard({
    orderId,
    shopName,
    details,
    total,
    deliveryDate,
    payment,
    shippingAddress,
    finalAmount = 0,
    totalShippingFee = 0,
    onReviewCreated,
}: OrderCardProps) {
    const router = useRouter();
    const [loadingPage, setLoadingPage] = useState(false);
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState<OrderDetail | null>(null);

    // Sử dụng hook tạo review (có form validation + toast thành công)
    const { onSubmit, isPending: isSubmittingReview } = useCreateReview();

    const handleViewInvoiceDetail = (id: string) => {
        setLoadingPage(true);
        router.push(`/orderhistory/${id}`);
    };

    const handleSubmitReview = async (data: any) => {
        if (!selectedProductForReview) return;

        // Set orderDetailId vào form data
        const formData = {
            ...data,
            orderDetailId: selectedProductForReview.id,
        };

        try {
            const result = await onSubmit(formData);
            if (result) {
                console.log('Review created successfully:', result);

                // Gọi callback để cập nhật danh sách reviews nếu có
                if (onReviewCreated) {
                    onReviewCreated(result);
                }

                // Đóng form sau khi submit thành công
                setShowWriteReview(false);
                setSelectedProductForReview(null);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };
    return (
        <div className="border rounded-md shadow-sm bg-white mb-4" >
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                    <div className="bg-red-600 text-white text-xs px-1 py-0.5 rounded-sm font-bold">Mall</div>
                    <div className="font-semibold truncate">{shopName}</div>
                    <button className="ml-2 text-sm px-2 py-0.5 border rounded text-red-500 border-red-500 hover:bg-red-50">
                        Chat
                    </button>
                </div>
            </div>

            {details.map((detail) => (
                <div key={detail.id} className="p-4 flex border-b gap-4 cursor-pointer" onClick={() => router.push(`/orderdetail/${orderId}`)}>
                    <img
                        src={
                            detail.blindBoxId && detail.blindBoxImage
                                ? detail.blindBoxImage
                                : detail.productImages?.[0] || "/placeholder.jpg"
                        }
                        alt="product"
                        width={80}
                        height={80}
                        className="object-cover rounded border"
                    />
                    <div className="flex-1">
                        <div className="font-medium mb-2">
                            {detail.blindBoxId && detail.blindBoxName ? detail.blindBoxName : detail.productName}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                            <div className="text-sm text-gray-500">x{detail.quantity}</div>
                            {(() => {
                                const actualStatus = getActualStatusFromLogs(detail.logs || '', detail.status);
                                return (
                                    <span
                                        className={`inline-block px-2 py-0.5 rounded text-xs font-medium uppercase
    ${actualStatus === OrderStatus.CANCELLED
                                                ? "bg-red-100 text-red-700"
                                                : actualStatus === OrderStatus.PENDING
                                                    ? "bg-yellow-100 text-yellow-700"
                                                    : actualStatus === OrderStatus.SHIPPING_REQUESTED
                                                        ? "bg-blue-100 text-blue-700"
                                                        : actualStatus === OrderStatus.DELIVEREDING
                                                            ? "bg-green-100 text-green-700"
                                                            : actualStatus === OrderStatus.DELIVERED
                                                                ? "bg-purple-100 text-purple-700"
                                                                : actualStatus === OrderStatus.IN_INVENTORY
                                                                    ? "bg-teal-100 text-teal-700"
                                                                    : "bg-gray-100 text-gray-600"
                                            }`}
                                    >
                                        {OrderStatusText[actualStatus] ?? "Không xác định"}
                                    </span>
                                );
                            })()}
                            {payment?.status === PaymentInfoStatus.Paid && (
                                <button
                                    className="text-xs bg-orange-500 text-white px-2 py-1 rounded hover:bg-orange-600 transition-colors"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setSelectedProductForReview(detail);
                                        setShowWriteReview(true);
                                    }}
                                >
                                    Đánh giá
                                </button>
                            )}
                        </div>
                    </div>
                    <div className="text-right">
                        <div className="text-red-500 font-semibold">
                            {detail.unitPrice.toLocaleString()}₫
                        </div>
                    </div>
                </div>
            ))}

            <div className="p-4 flex flex-col sm:flex-row sm:justify-end sm:items-center bg-gray-50 gap-4">
                <div className="flex flex-wrap gap-2 items-center">
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                                Xem hóa đơn
                            </button>
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>Hóa đơn đơn hàng</DialogTitle>
                            </DialogHeader>

                            <div className="space-y-6 text-sm mt-4">
                                <div className="border rounded p-4 bg-white">
                                    <div className="font-semibold mb-2">🛒 Sản phẩm đã mua</div>
                                    <table className="w-full text-sm border-t border-gray-200">
                                        <thead>
                                            <tr className="text-left border-b bg-gray-100">
                                                <th className="p-2">Tên sản phẩm</th>
                                                <th className="p-2 text-center">SL</th>
                                                <th className="p-2 text-right">Đơn giá</th>
                                                <th className="p-2 text-right">ship</th>
                                                <th className="p-2 text-right">Thành tiền</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {details.map((item) => (
                                                <tr key={item.id} className="border-b">
                                                    <td className="p-2">
                                                        {item.blindBoxId && item.blindBoxName ? item.blindBoxName : item.productName}
                                                    </td>
                                                    <td className="p-2 text-center">{item.quantity}</td>
                                                    <td className="p-2 text-right">{item.unitPrice.toLocaleString()}₫</td>
                                                    <td className="p-2 text-right">0₫</td>
                                                    <td className="p-2 text-right">{(item.unitPrice * item.quantity).toLocaleString()}₫</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>

                                <div className="border-t pt-4 text-right text-sm flex justify-between items-center">
                                    <div> <Button onClick={(e) => {
                                        e.stopPropagation();
                                        handleViewInvoiceDetail(orderId);
                                    }}>
                                        Xem chi tiết
                                    </Button>

                                    </div>
                                    <div className="border-t pt-3 mt-3 space-y-2">
                                        {payment ? (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Tạm tính:</span>
                                                    <span>{payment.amount.toLocaleString()}₫</span>
                                                </div>
                                                {totalShippingFee > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Phí vận chuyển:</span>
                                                        <span>{totalShippingFee.toLocaleString()}₫</span>
                                                    </div>
                                                )}
                                                {payment.amount !== payment.netAmount && (
                                                    <div className="flex justify-between text-green-600">
                                                        <span>Giảm giá:</span>
                                                        <span>-{(payment.amount - payment.netAmount).toLocaleString()}₫</span>
                                                    </div>
                                                )}
                                                <div className="flex gap-2 font-semibold text-base border-t pt-2 mt-2">
                                                    <span>Tổng thanh toán:</span>
                                                    <span className="text-red-500">{payment.netAmount.toLocaleString()}₫</span>
                                                </div>
                                            </>
                                        ) : (
                                            <>
                                                <div className="flex justify-between">
                                                    <span>Tạm tính:</span>
                                                    <span>{total.toLocaleString()}₫</span>
                                                </div>
                                                {totalShippingFee > 0 && (
                                                    <div className="flex justify-between">
                                                        <span>Phí vận chuyển:</span>
                                                        <span>{totalShippingFee.toLocaleString()}₫</span>
                                                    </div>
                                                )}
                                                <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2">
                                                    <span>Tổng thanh toán:</span>
                                                    <span className="text-red-500">{(total + totalShippingFee).toLocaleString()}₫</span>
                                                </div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <button className=" text-black border border-gray-300 px-4 py-1 rounded hover:bg-gray-100">
                        Liên hệ người bán
                    </button>
                </div>
            </div>

            {/* Review Dialog for Selected Product */}
            <Dialog open={showWriteReview} onOpenChange={setShowWriteReview}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-3">
                            {selectedProductForReview && (
                                <>
                                    <img
                                        src={
                                            selectedProductForReview.blindBoxId && selectedProductForReview.blindBoxImage
                                                ? selectedProductForReview.blindBoxImage
                                                : selectedProductForReview.productImages?.[0] || "/placeholder.jpg"
                                        }
                                        alt="product"
                                        className="w-12 h-12 object-cover rounded border"
                                    />
                                    <div>
                                        <div className="font-medium">
                                            Đánh giá sản phẩm
                                        </div>
                                        <div className="text-sm text-gray-600 font-normal">
                                            {selectedProductForReview.blindBoxId && selectedProductForReview.blindBoxName
                                                ? selectedProductForReview.blindBoxName
                                                : selectedProductForReview.productName}
                                        </div>
                                    </div>
                                </>
                            )}
                        </DialogTitle>
                    </DialogHeader>
                    {selectedProductForReview && (
                        <WriteReview
                            productId={selectedProductForReview.productId || selectedProductForReview.blindBoxId || orderId}
                            onSubmit={handleSubmitReview}
                            isSubmitting={isSubmittingReview}
                            onCancel={() => {
                                setShowWriteReview(false);
                                setSelectedProductForReview(null);
                            }}
                        />
                    )}
                </DialogContent>
            </Dialog>

            <Backdrop open={loadingPage} />
        </div>
    );
}
