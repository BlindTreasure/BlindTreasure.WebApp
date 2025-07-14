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
  const router = useRouter();

  useEffect(() => {
    if (!orderId) return;
    const fetchData = async () => {
      const res = await getOrderDetailApi(orderId as string);
      if (res?.isSuccess) {
        setOrder(res.value.data);
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
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 mt-20">
      <h1 className="text-2xl font-bold flex justify-center">Chi tiết đơn hàng #{order.id.slice(0, 8).toUpperCase()}</h1>

      <Card>
        <CardContent className="p-4 space-y-3 text-sm">
          <div className="flex items-center gap-2 text-muted-foreground">
            <span> 📅 Ngày đặt: {format(new Date(order.placedAt), "dd/MM/yyyy")}</span>
          </div>
          <div>
            {boxTypes} loại blindbox • {totalItems} sản phẩm tổng cộng
          </div>
          <div>
            Trạng thái:{" "}
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
          <div>
            Phương thức thanh toán: <strong>{order.payment.method}</strong>
          </div>
          <div>
            Mã giao dịch: <strong>{order.payment.transactionId}</strong>
          </div>
          {order.completedAt && order.payment.paidAt && (
            <div>
              Ngày thanh toán:{" "}
              <strong>
                {new Date(order.payment.paidAt).toLocaleDateString("vi-VN")}
              </strong>
            </div>
          )}

          {order.payment.refundedAmount > 0 && (
            <div className="text-red-500">
              Đã hoàn tiền:{" "}
              <strong>
                {order.payment.refundedAmount.toLocaleString("vi-VN")}₫
              </strong>
            </div>
          )}

          {order.payment.amount !== order.payment.netAmount && (
            <div>
              Giảm giá: -{(order.payment.amount - order.payment.netAmount).toLocaleString("vi-VN")}₫
            </div>
          )}
          <div className="font-semibold text-base">
            Tổng thanh toán:{" "}
            <span className="text-red-500">
              {order.payment.netAmount.toLocaleString("vi-VN")}₫
            </span>
          </div>
        </CardContent>
      </Card>

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
