"use client";

import { format } from "date-fns";
import { CalendarDays } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { useState } from "react";

// Fake data
const orderDetail = {
  id: "ORD12345",
  date: new Date("2025-05-10"),
  totalItems: 5,
  boxTypes: 3,
  totalPrice: 500000,
  items: [
    {
      name: "Cute Animal Blindbox",
      quantity: 2,
      price: 200000,
    },
    {
      name: "Mystery Tech Blindbox",
      quantity: 3,
      price: 300000,
    },
  ],
};

export default function OrderDetailPage() {
  const [tab, setTab] = useState("order");

  return (
    <div className="max-w-3xl mx-auto px-4 py-16 space-y-6 mt-20">
      <h1 className="text-2xl font-bold">Chi tiết đơn hàng #{orderDetail.id}</h1>

      <Card>
        <CardContent className="p-4 space-y-3">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <CalendarDays className="w-4 h-4" />
            <span>Ngày đặt: {format(orderDetail.date, "dd/MM/yyyy")}</span>
          </div>
          <div className="text-sm">
            {orderDetail.boxTypes} loại blindbox • {orderDetail.totalItems} box tổng cộng
          </div>
          <div className="text-sm font-medium text-green-600">
            Tổng tiền: {orderDetail.totalPrice.toLocaleString("vi-VN")}₫
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Sản phẩm</h2>
        {orderDetail.items.map((item, index) => (
          <Card key={index}>
            <CardContent className="p-4 flex flex-col sm:flex-row sm:justify-between sm:items-center">
              <div>
                <div className="font-medium">{item.name}</div>
                <div className="text-sm text-muted-foreground">
                  Số lượng: {item.quantity}
                </div>
              </div>
              <div className="mt-2 sm:mt-0 font-semibold text-green-700">
                {(item.price).toLocaleString("vi-VN")}₫
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Hỗ trợ - Tabs */}
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
