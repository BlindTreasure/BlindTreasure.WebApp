import { format } from "date-fns";
import { CalendarDays, PackageCheck } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";

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

      {/* Hỗ trợ */}
      <div className="pt-6 border-t">
        <h2 className="text-lg font-semibold mb-2">Hỗ trợ</h2>
        <div className="flex flex-col sm:flex-row justify-center sm:justify-start sm:space-x-6 space-y-2 sm:space-y-0 text-sm text-[#d02a2a]">
          <Link href="/support/order-issues" className="hover:underline text-center sm:text-left">
            Vấn đề đơn hàng
          </Link>
          <Link href="/support/shipping-info" className="hover:underline text-center sm:text-left">
            Thông tin giao hàng
          </Link>
          <Link href="/support/returns" className="hover:underline text-center sm:text-left">
            Trả hàng
          </Link>
        </div>
      </div>
    </div>
  );
}
