"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { format } from "date-fns";
import { CalendarDays } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import { OrderResponse } from "@/services/order/typings";
import useGetOrderById from "../hooks/useGetOrderById";
import { PaymentInfoStatus, PaymentInfoStatusText } from "@/const/products";

export default function OrderDetail() {
  const { orderId } = useParams();
  const { getOrderDetailApi, isPending } = useGetOrderById();
  const [order, setOrder] = useState<OrderResponse | null>(null);
  const [tab, setTab] = useState("order");

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


          {/* Đã hoàn tiền (nếu có) */}
          {order.payment.refundedAmount > 0 && (
            <div className="text-red-500">
              Đã hoàn tiền:{" "}
              <strong>
                {order.payment.refundedAmount.toLocaleString("vi-VN")}₫
              </strong>
            </div>
          )}

          {/* Giảm giá (nếu có) */}
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
          <Card key={index}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <div className="font-medium">
                  {item.blindBoxName || item.productName}{" "}
                  {item.blindBoxId && (
                    <span className="text-xs italic text-green-500">
                      (Blindbox)
                    </span>
                  )}
                </div>

                <div className="text-sm text-muted-foreground">
                  Số lượng: {item.quantity}
                </div>
              </div>
              <div className="mt-2 sm:mt-0 font-semibold text-green-700">
                {item.totalPrice.toLocaleString("vi-VN")}₫
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="pt-6 border-t">
        <h2 className="text-lg font-semibold mb-3">Hỗ trợ</h2>
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <TabsList className="flex flex-col sm:flex-row gap-2 sm:gap-6 text-[#d02a2a]">
            <TabsTrigger value="order">Vấn đề đơn hàng</TabsTrigger>
            <TabsTrigger value="shipping">Thông tin giao hàng</TabsTrigger>
            <TabsTrigger value="return">Trả hàng</TabsTrigger>
          </TabsList>

          <div className="mt-4 text-sm text-muted-foreground bg-gray-50 p-4 rounded-md border">
            <TabsContent value="order">
              Nếu bạn gặp sự cố với đơn hàng, vui lòng liên hệ chúng tôi qua hotline hoặc gửi yêu cầu hỗ trợ trong mục Liên hệ.
            </TabsContent>
            <TabsContent value="shipping">
              Đơn hàng của bạn sẽ được giao trong vòng 3–5 ngày làm việc. Vui lòng kiểm tra tình trạng giao hàng trong phần Theo dõi đơn hàng.
            </TabsContent>
            <TabsContent value="return">
              Bạn có thể trả hàng trong vòng 7 ngày nếu sản phẩm lỗi hoặc không đúng mô tả. Truy cập mục Chính sách hoàn trả để biết thêm chi tiết.
            </TabsContent>
          </div>
        </Tabs>
      </div>
    </div>
  );
}
