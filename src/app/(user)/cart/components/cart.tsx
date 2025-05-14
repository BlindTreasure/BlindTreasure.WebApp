'use client'
import React, { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { X } from "lucide-react";

const fakeCartItems = [
  {
    id: 1,
    name: "DODO Nami Twinkle Bunny Plush Doll Blindbox Series",
    image: "/images/blindbox_2.jpg",
    variant: "1 Blind",
    materials: "Plastic, Textile, Cotton, Polyester",
    quantity: 1,
    price: 280000,
  },
  {
    id: 2,
    name: "DODO Nami Twinkle Bunny Plush Doll Blindbox Series",
    image: "/images/blindbox_2.jpg",
    variant: "1 Blind",
    materials: "Plastic, Textile, Cotton, Polyester",
    quantity: 1,
    price: 280000,
  },
  {
    id: 3,
    name: "DODO Nami Twinkle Bunny Plush Doll Blindbox Series",
    image: "/images/blindbox_2.jpg",
    variant: "1 Blind",
    materials: "Plastic, Textile, Cotton, Polyester",
    quantity: 1,
    price: 280000,
  },
];

export default function Cart() {
  const [selectedItems, setSelectedItems] = useState<number[]>([1]);

  const toggleSelect = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const handleRemove = (id: number) => {
    alert(`Bạn vừa xoá sản phẩm có id: ${id}`);
  };

  const total = fakeCartItems
    .filter((item) => selectedItems.includes(item.id))
    .reduce((acc, item) => acc + item.price * item.quantity, 0);

  return (
    <div className="mt-16 p-4 sm:px-8 lg:px-20 mt-36">
      <h2 className="text-lg sm:text-xl font-semibold mb-4">Tổng sản phẩm</h2>
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Product List */}
        <Card className="w-full lg:flex-1">
          <CardContent className="p-4 sm:p-6">
            {fakeCartItems.map((item) => (
              <div
                key={item.id}
                className="relative flex flex-col sm:flex-row gap-4 py-4 pr-8 border-b last:border-none"
              >
                {/* Nút xoá cố định ở góc trên phải */}
                <div className="absolute top-2 right-2 z-10">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleRemove(item.id)}
                    className="p-1"
                  >
                    <X className="w-4 h-4 text-[#d02a2a]" />
                  </Button>
                </div>

                <div className="flex items-start gap-4">
                  <Checkbox
                    checked={selectedItems.includes(item.id)}
                    onCheckedChange={() => toggleSelect(item.id)}
                  />
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 sm:w-24 sm:h-24 object-cover rounded"
                  />
                </div>

                <div className="flex-1 text-sm space-y-1">
                  <div className="font-semibold leading-tight">{item.name}</div>
                  <div className="text-xs px-2 py-0.5 bg-gray-200 w-fit rounded">
                    {item.variant}
                  </div>
                  <div className="text-gray-600 text-xs">Chất liệu: {item.materials}</div>
                  <div className="text-gray-600 text-xs">Số lượng: {item.quantity}</div>
                  <div className="text-[#d02a2a] font-semibold text-sm">
                    Giá: {item.price.toLocaleString()}₫
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Order Summary */}
        <Card className="w-full lg:w-80 h-fit sticky top-10">
          <CardContent className="p-4 sm:p-6">
            <h2 className="text-lg font-semibold mb-4">Tóm tắt đơn hàng</h2>
            <div className="flex justify-between text-sm mb-4">
              <span>Tổng tiền:</span>
              <span className="text-[#d02a2a] font-semibold">
                {total.toLocaleString()}₫
              </span>
            </div>
            <div className="flex flex-col gap-2">
              <Button className="w-full">Thanh toán</Button>
              <Button variant="outline" className="w-full">Tiếp tục mua sắm</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
