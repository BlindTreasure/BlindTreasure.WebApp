import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

// Fake data
const fakeOrders = [
  {
    id: "ORD12345",
    date: new Date("2025-05-10"),
    totalItems: 5,
    boxTypes: 3,
    totalPrice: 500000,
  },
  {
    id: "ORD12346",
    date: new Date("2025-05-12"),
    totalItems: 2,
    boxTypes: 1,
    totalPrice: 200000,
  },
  {
    id: "ORD12347",
    date: new Date("2025-05-14"),
    totalItems: 4,
    boxTypes: 2,
    totalPrice: 350000,
  },
];

export default function OrderHistory() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 py-20">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Lịch sử đơn hàng
      </h1>

      <div className="space-y-4">
        {fakeOrders.map((order) => (
          <Card key={order.id} className="shadow-sm hover:shadow-md transition-shadow">
            <CardContent className="p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="space-y-1 text-center sm:text-left">
                <div className="font-semibold text-lg text-primary">
                  Đơn hàng #{order.id}
                </div>

                <div className="flex justify-center sm:justify-start items-center gap-2 text-sm text-muted-foreground">
                  <CalendarDays className="w-4 h-4" />
                  <span>{format(order.date, "dd/MM/yyyy")}</span>
                </div>

                <div className="text-sm">
                  {order.boxTypes} loại blindbox • {order.totalItems} box tổng cộng
                </div>

                <div className="text-sm font-medium text-green-600">
                  Tổng tiền: {order.totalPrice.toLocaleString("vi-VN")}₫
                </div>
              </div>

              <div className="text-center sm:text-right">
                <Link href={`/orderhistory/${order.id}`}>
                  <Button variant="outline" className="mt-2 md:mt-0">
                    Xem chi tiết
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
