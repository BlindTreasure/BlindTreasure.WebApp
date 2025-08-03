"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { format } from "date-fns";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderResponse } from "@/services/order/typings";
import useGetOrderById from "../hooks/useGetOrderById";
import { PaymentInfoStatus, PaymentInfoStatusText } from "@/const/products";

export default function OrderHistory() {
  const { orderId } = useParams();
  const { getOrderDetailApi, isPending } = useGetOrderById();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [tab, setTab] = useState("order");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;
    const fetchData = async () => {
      try {
        setError(null);
        const res = await getOrderDetailApi(orderId as string);
        if (res?.isSuccess) {
          setOrder(res.value.data);
        } else {
          setError("Không tìm thấy đơn hàng hoặc bạn không có quyền truy cập.");
        }
      } catch (err) {
        setError("Có lỗi xảy ra khi tải thông tin đơn hàng.");
      }
    };
    fetchData();
  }, [orderId]);

  if (isPending || !order) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 mt-20 space-y-4">
        <Skeleton className="h-6 w-1/2" />
        <Card><CardContent className="p-4 space-y-3"><Skeleton className="h-4 w-full" /></CardContent></Card>
        <div className="space-y-2">
          {[...Array(2)].map((_, i) => (
            <Card key={i}><CardContent className="p-4"><Skeleton className="h-4 w-full" /></CardContent></Card>
          ))}
        </div>
      </div>
    );
  }

  const totalItems = order.details.reduce((sum, item) => sum + item.quantity, 0);
  const boxTypes = new Set(
    order.details.filter((d) => d.blindBoxId).map((d) => d.blindBoxId)
  ).size;
  const totalPrice = order.totalAmount;

  return (
    <div className="max-w-6xl mx-auto px-4 py-16 space-y-6 mt-20">
      <h1 className="text-2xl font-bold flex justify-center">Chi tiết đơn hàng #{order.id.slice(0, 8).toUpperCase()}</h1>

      {/* Order Summary */}
      <div className="flex flex-wrap gap-6">
        <Card className="w-full lg:w-[calc(50%-12px)]">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              📋 Thông tin đơn hàng
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Ngày đặt:</span>
                <span className="font-medium">{format(new Date(order.placedAt), "dd/MM/yyyy HH:mm")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Số lượng sản phẩm:</span>
                <span className="font-medium">{totalItems} sản phẩm • {boxTypes} loại blindbox</span>
              </div>
              {order.completedAt && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Ngày hoàn thành:</span>
                  <span className="font-medium">{format(new Date(order.completedAt), "dd/MM/yyyy HH:mm")}</span>
                </div>
              )}
              {order.payment && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span
                    className={`inline-block px-2 py-0.5 rounded text-xs font-medium uppercase
                  ${order.payment.status === PaymentInfoStatus.Paid || order.payment.status === PaymentInfoStatus.Completed
                        ? "bg-green-100 text-green-700"
                        : "bg-red-100 text-red-700"
                      }`}
                  >
                    {PaymentInfoStatusText[order.payment.status]}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {order.payment && (
          <Card className="w-full lg:w-[calc(50%-12px)]">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                💳 Thông tin thanh toán
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Phương thức:</span>
                  <span className="font-medium">{order.payment?.method || "Chưa có thông tin"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mã giao dịch:</span>
                  <span className="font-medium">{order.payment?.paymentIntentId || order.payment?.transactionId || "Chưa có thông tin"}</span>
                </div>
                {order.payment?.paidAt && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Ngày thanh toán:</span>
                    <span className="font-medium">{new Date(order.payment.paidAt).toLocaleDateString("vi-VN")}</span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-600">Trạng thái:</span>
                  <span className="font-medium">{order.payment?.status || "Chưa có thông tin"}</span>
                </div>
                {order.payment?.refundedAmount > 0 && (
                  <div className="flex justify-between text-red-500">
                    <span>Đã hoàn tiền:</span>
                    <span className="font-medium">{order.payment.refundedAmount.toLocaleString("vi-VN")}₫</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {order.shippingAddress && (
          <Card className="w-full lg:w-[calc(50%-12px)]">
            <CardContent className="p-4">
              <h3 className="font-semibold mb-3 flex items-center gap-2">
                🚚 Thông tin giao hàng
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Người nhận:</span>
                    <span className="font-medium ml-2">{order.shippingAddress.fullName}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Số điện thoại:</span>
                    <span className="font-medium ml-2">{order.shippingAddress.phone}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div>
                    <span className="text-gray-600">Địa chỉ:</span>
                    <span className="font-medium ml-2">{order.shippingAddress.addressLine}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Khu vực:</span>
                    <span className="font-medium ml-2">
                      {order.shippingAddress.city}, {order.shippingAddress.province}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        <Card className="w-full lg:w-[calc(50%-12px)]">
          <CardContent className="p-4">
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              💰 Chi tiết thanh toán
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Tạm tính:</span>
                <span>
                  {(order.finalAmount || order.totalAmount || 0).toLocaleString("vi-VN")}₫
                </span>
              </div>
              {order.totalShippingFee && order.totalShippingFee > 0 && (
                <div className="flex justify-between">
                  <span className="text-gray-600">Phí vận chuyển:</span>
                  <span>{order.totalShippingFee.toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              {order.payment?.amount && order.payment?.netAmount && order.payment.amount !== order.payment.netAmount && (
                <div className="flex justify-between text-green-600">
                  <span>Giảm giá:</span>
                  <span>-{(order.payment.amount - order.payment.netAmount).toLocaleString("vi-VN")}₫</span>
                </div>
              )}
              {order.promotionNote && (
                <div className="flex justify-between text-green-600">
                  <span>Khuyến mãi:</span>
                  <span>{order.promotionNote}</span>
                </div>
              )}
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between font-semibold text-base">
                  <span>Tổng thanh toán:</span>
                  <span className="text-red-500">
                    {(order.payment?.netAmount || order.payment?.amount || order.totalAmount || 0).toLocaleString("vi-VN")}₫
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sản phẩm</h2>
        {order.details.map((item, index) => (
          <Card
            key={index}
            className="transition-transform duration-200 hover:scale-[1.02] hover:shadow-md cursor-pointer"
            onClick={() => {
              if (item.blindBoxId) {
                router.push(`/detail-blindbox/${item.blindBoxId}`);
              } else {
                router.push(`/detail/${item.productId}`);
              }
            }}
          >
            <CardContent className="p-4 flex items-start gap-4">
              <img
                src={
                  item.blindBoxId
                    ? item.blindBoxImage || "/placeholder.jpg"
                    : item.productImages?.[0] || "/placeholder.jpg"
                }
                alt="product image"
                className="w-20 h-20 object-cover rounded border"
              />

              <div className="flex-1 flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <div className="space-y-1">
                  <div className="font-medium text-gray-900">
                    {item.blindBoxName || item.productName}{" "}
                    {item.blindBoxId && (
                      <span className="text-xs italic text-green-500 ml-1">
                        (Blindbox)
                      </span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">
                    Số lượng: {item.quantity}
                  </div>
                </div>

                <div className="mt-2 sm:mt-0 text-right">
                  {item.unitPrice * item.quantity !== item.totalPrice && (
                    <div className="text-sm text-gray-400 line-through">
                      {(item.unitPrice * item.quantity).toLocaleString("vi-VN")}₫
                    </div>
                  )}
                  <div className="text-base font-semibold text-red-500">
                    {item.totalPrice.toLocaleString("vi-VN")}₫
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
