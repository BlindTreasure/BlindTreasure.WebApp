import { CalendarDays } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";
import { Button } from "@/components/ui/button";

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 py-20">
      <h1 className="text-2xl font-bold mb-6 text-center sm:text-left">
        Lịch sử đơn hàng
      </h1>

      <div className="overflow-x-auto border rounded-lg shadow-sm">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-gray-100 text-muted-foreground">
            <tr>
              <th className="px-4 py-3">Mã đơn</th>
              <th className="px-4 py-3">Ngày đặt</th>
              <th className="px-4 py-3">Loại box</th>
              <th className="px-4 py-3">Số lượng</th>
              <th className="px-4 py-3">Tổng tiền</th>
              <th className="px-4 py-3 text-center">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {fakeOrders.map((order, idx) => (
              <tr
                key={order.id}
                className={idx % 2 === 0 ? "bg-white" : "bg-gray-50"}
              >
                <td className="px-4 py-4 font-medium text-primary">
                  #{order.id}
                </td>
                <td className="px-4 py-4 flex items-center gap-1 text-muted-foreground">
                  <CalendarDays className="w-4 h-4 shrink-0" />
                  {format(order.date, "dd/MM/yyyy")}
                </td>
                <td className="px-4 py-4">{order.boxTypes}</td>
                <td className="px-4 py-4">{order.totalItems}</td>
                <td className="px-4 py-4 text-green-600 font-medium">
                  {order.totalPrice.toLocaleString("vi-VN")}₫
                </td>
                <td className="px-4 py-4 text-center">
                  <Link href={`/orderhistory/${order.id}`}>
                    <Button variant="outline" size="sm">
                      Xem chi tiết
                    </Button>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
