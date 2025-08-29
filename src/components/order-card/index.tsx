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
import { useState, useEffect } from "react";
import { Backdrop } from "../backdrop";
import { Button } from "../ui/button";
import WriteReview from "../product-reviews/write-review";
import useCreateReview from "@/app/(user)/purchased/hooks/useCreateReview";
import useGetReviewStatus from "@/app/(user)/purchased/hooks/useGetReviewStatus";
import { useServiceCreateGroupPaymentLink, useServiceCancelPayment } from "@/services/stripe/services";

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
    userIdOfSeller?: string;
    shopName: string;
    details: OrderDetail[];
    total: number;
    deliveryDate: string;
    payment?: PaymentInfo | null;
    finalAmount?: number;
    shippingAddress?: ShippingAddress;
    totalShippingFee?: number;
    checkoutGroupId: string;
    currentTab?: string;
    isGroupDuplicate?: boolean; // Check đơn cùng checkoutGroupId
    onReviewCreated?: (reviewData: any) => void;
    handleOpenChat: (targetUserId: string) => void;
    onOrderCancelled?: () => void; // Callback để refresh data sau khi hủy đơn
}

export default function OrderCard({
    orderId,
    shopName,
    details,
    total,
    userIdOfSeller,
    deliveryDate,
    payment,
    shippingAddress,
    finalAmount = 0,
    totalShippingFee = 0,
    checkoutGroupId,
    currentTab,
    isGroupDuplicate = false,
    onReviewCreated,
    handleOpenChat,
    onOrderCancelled,
}: OrderCardProps) {
    const router = useRouter();
    const [loadingPage, setLoadingPage] = useState(false);
    const [showWriteReview, setShowWriteReview] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState<OrderDetail | null>(null);
    const [reviewStatuses, setReviewStatuses] = useState<Record<string, boolean>>({});
    const [loadingReviewStatuses, setLoadingReviewStatuses] = useState<Record<string, boolean>>({});
    const [isCancelled, setIsCancelled] = useState(false);
    const { onSubmit, isPending: isSubmittingReview } = useCreateReview();
    const { getReviewStatusApi } = useGetReviewStatus();
    const { mutate: createGroupPaymentLink, isPending: isRetryingPayment } = useServiceCreateGroupPaymentLink();
    const { mutate: cancelPayment, isPending: isCancellingOrder } = useServiceCancelPayment();
    const handleRetryPayment = (checkoutGroupId: string) => {
        if (!checkoutGroupId) {
            console.error('checkoutGroupId is required for retry payment');
            return;
        }

        createGroupPaymentLink(
            { checkoutGroupId },
            {
                onSuccess: (response) => {
                    if (response.value?.data && typeof response.value.data === 'string') {
                        window.location.href = response.value.data;
                    } else {
                        console.error('No payment URL found in response:', response);
                    }
                },
                onError: (error) => {
                    console.error('Error creating group payment link:', error);
                }
            }
        );
    };

    const handleCancelOrder = (checkoutGroupId: string) => {
        const data: REQUEST.CancelPayment = {
            checkoutGroupId: checkoutGroupId
        };

        cancelPayment(data, {
            onSuccess: () => {
                setIsCancelled(true);
                setTimeout(() => {
                    if (onOrderCancelled) {
                        onOrderCancelled();
                    }
                }, 1000);
            }
        });
    };

    useEffect(() => {
        const checkReviewStatuses = async () => {
            const statusPromises = details.map(async (detail) => {
                setLoadingReviewStatuses(prev => ({ ...prev, [detail.id]: true }));
                try {
                    const response = await getReviewStatusApi(detail.id);
                    if (response?.isSuccess) {
                        return { id: detail.id, canReview: !response.value.data };
                    }
                    return { id: detail.id, canReview: true };
                } catch (error) {
                    console.error(`Error checking review status for ${detail.id}:`, error);
                    return { id: detail.id, canReview: true };
                } finally {
                    setLoadingReviewStatuses(prev => ({ ...prev, [detail.id]: false }));
                }
            });

            const results = await Promise.all(statusPromises);
            const statusMap = results.reduce((acc, { id, canReview }) => {
                acc[id] = canReview;
                return acc;
            }, {} as Record<string, boolean>);

            setReviewStatuses(statusMap);
        };

        if (details.length > 0) {
            checkReviewStatuses();
        }
    }, [details]);

    const handleViewInvoiceDetail = (id: string) => {
        setLoadingPage(true);
        if (checkoutGroupId && details.length > 1) {
            router.push(`/ordergroup/${checkoutGroupId}`);
        } else {
            router.push(`/orderhistory/${id}`);
        }
    };

    const handleSubmitReview = async (data: any) => {
        if (!selectedProductForReview) return;
        const formData = {
            ...data,
            orderDetailId: selectedProductForReview.id,
        };
        try {
            const result = await onSubmit(formData);
            if (result) {
                setReviewStatuses(prev => ({
                    ...prev,
                    [selectedProductForReview.id]: false
                }));
                if (onReviewCreated) {
                    onReviewCreated(result);
                }
                setShowWriteReview(false);
                setSelectedProductForReview(null);
            }
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    };
    return (
        <div className={`border rounded-md shadow-sm mb-4 transition-all duration-300 ${isCancelled ? 'bg-gray-100 opacity-75' : 'bg-white'
            }`}>
            <div className="flex justify-between items-center p-4 border-b bg-gray-50">
                <div className="flex items-center gap-2">
                    <div className="font-semibold truncate">{shopName}</div>
                    {isCancelled && (
                        <span className="text-sm px-2 py-0.5 bg-red-100 text-red-700 rounded">
                            Đã hủy đơn
                        </span>
                    )}
                    <button className="ml-2 text-sm px-2 py-0.5 border rounded text-red-500 border-red-500 hover:bg-red-50">
                        Chat
                    </button>
                </div>
            </div>

            {details.map((detail) => (
                <div key={detail.id} className="p-4 flex border-b gap-4 cursor-pointer" onClick={() => {
                    if (checkoutGroupId && details.length > 1) {
                        router.push(`/ordergroup/${checkoutGroupId}`);
                    } else {
                        router.push(`/orderdetail/${orderId}`);
                    }
                }}>
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

                                let displayText = OrderStatusText[actualStatus] ?? "Không xác định";
                                if (actualStatus === OrderStatus.PENDING && payment?.status === PaymentInfoStatus.Pending) {
                                    displayText = "Chờ thanh toán";
                                }

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
                                        {displayText}
                                    </span>
                                );
                            })()}
                            <div>
                                {payment?.status === PaymentInfoStatus.Paid && (
                                    <>
                                        {loadingReviewStatuses[detail.id] ? (
                                            <button
                                                className="bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed"
                                                disabled
                                            >
                                                Đang kiểm tra...
                                            </button>
                                        ) : reviewStatuses[detail.id] ? (
                                            <button
                                                className="bg-orange-500 text-white px-4 py-1 rounded hover:bg-orange-600 transition-colors"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    setSelectedProductForReview(detail);
                                                    setShowWriteReview(true);
                                                }}
                                            >
                                                Đánh giá
                                            </button>
                                        ) : (
                                            <button
                                                className="bg-gray-400 text-white px-4 py-1 rounded cursor-not-allowed"
                                                disabled
                                            >
                                                Đã đánh giá
                                            </button>
                                        )}
                                    </>
                                )}
                            </div>
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
                    {payment?.status === PaymentInfoStatus.Pending && (() => {
                        if (currentTab === "pending") {
                            return true;
                        }
                        return !isGroupDuplicate;
                    })() && (
                            <>
                                <button
                                    className="bg-[#3bd02a] text-white border border-gray-300 px-4 py-1 rounded hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRetryPayment(checkoutGroupId);
                                    }}
                                    disabled={isRetryingPayment || isCancelled}
                                >
                                    {isRetryingPayment ? 'Đang xử lý...' : 'Thanh toán lại'}
                                </button>
                                <button
                                    className="bg-[#d02a2a] text-white border border-gray-300 px-4 py-1 rounded hover:bg-opacity-80 disabled:opacity-50 disabled:cursor-not-allowed"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleCancelOrder(checkoutGroupId);
                                    }}
                                    disabled={isCancellingOrder || isCancelled}
                                >
                                    {isCancelled ? 'Đã hủy' : isCancellingOrder ? 'Đang hủy...' : 'Hủy đơn'}
                                </button>
                            </>
                        )}
                    <Dialog>
                        <DialogTrigger asChild>
                            <button className="border border-gray-300 px-4 py-1 rounded hover:bg-gray-100" onClick={(e) => e.stopPropagation()}>
                                Xem hóa đơn
                            </button>
                        </DialogTrigger>

                        <DialogContent className="max-w-2xl p-6 max-h-[90vh] overflow-y-auto">
                            <DialogHeader>
                                <DialogTitle>
                                    {checkoutGroupId && details.length > 1
                                        ? `Hóa đơn nhóm đơn hàng (${details.length} sản phẩm)`
                                        : "Hóa đơn đơn hàng"
                                    }
                                </DialogTitle>
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
                                        {(() => {
                                            const subtotal = total;
                                            const totalShipFee = details.reduce((sum, detail) => {
                                                const shipmentFees = detail.shipments?.reduce((shipSum, shipment) =>
                                                    shipSum + (shipment.totalFee || 0), 0) || 0;
                                                return sum + shipmentFees;
                                            }, 0);
                                            const totalDiscount = details.reduce((sum, detail) =>
                                                sum + (detail.detailDiscountPromotion || 0), 0);
                                            const finalTotal = subtotal + totalShipFee - totalDiscount;

                                            return (
                                                <>
                                                    <div className="flex justify-between">
                                                        <span>Tạm tính:</span>
                                                        <span>{subtotal.toLocaleString()}₫</span>
                                                    </div>
                                                    {totalShipFee > 0 && (
                                                        <div className="flex justify-between">
                                                            <span>Phí vận chuyển:</span>
                                                            <span>{totalShipFee.toLocaleString()}₫</span>
                                                        </div>
                                                    )}
                                                    {totalDiscount > 0 && (
                                                        <div className="flex justify-between text-green-600">
                                                            <span>Giảm giá:</span>
                                                            <span>-{totalDiscount.toLocaleString()}₫</span>
                                                        </div>
                                                    )}
                                                    <div className="flex justify-between font-semibold text-base border-t pt-2 mt-2 space-x-2">
                                                        <span>Tổng thanh toán:</span>
                                                        <span className="text-red-500">{finalTotal.toLocaleString()}₫</span>
                                                    </div>
                                                </>
                                            );
                                        })()}
                                    </div>
                                </div>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <button
                        onClick={() => handleOpenChat(userIdOfSeller || '')}
                        className=" text-black border border-gray-300 px-4 py-1 rounded hover:bg-gray-100">
                        Liên hệ người bán
                    </button>
                </div>
            </div>

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
