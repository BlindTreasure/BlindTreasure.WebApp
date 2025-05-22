"use client";

import React from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PlusCircle, Search } from "lucide-react";
import Link from "next/link";
import ProductTable, { Product } from "@/components/product-table";

const mockProducts: Product[] = [
  {
    id: 1,
    name: "Blindbox Labubu Series 1",
    price: "450.000₫",
    stock: 85,
    status: "Hiển thị",
    image: "/images/blindbox_2.jpg",
  },
  {
    id: 2,
    name: "Blindbox Labubu Secret Edition",
    price: "650.000₫",
    stock: 15,
    status: "Hiển thị",
    image: "/images/blindbox_2.jpg",
  },
  {
    id: 3,
    name: "Blindbox Animal Friends Set",
    price: "390.000₫",
    stock: 120,
    status: "Ẩn",
    image: "/images/blindbox_2.jpg",
  },
  {
    id: 4,
    name: "Blindbox Mini Pin Pack",
    price: "120.000₫",
    stock: 300,
    status: "Hiển thị",
    image: "/images/blindbox_2.jpg",
  },
];


export default function AllProductsPage() {
  return (
    <div className="space-y-6 mt-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <h2 className="text-2xl font-bold tracking-tight">Tất cả sản phẩm</h2>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <div className="relative w-full md:w-64">
            <Search className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
            <Input
              placeholder="Tìm kiếm sản phẩm..."
              className="pl-10"
            />
          </div>

          <Link href="/seller/products/create">
            <Button className="flex items-center gap-2">
              <PlusCircle size={18} />
              Thêm sản phẩm
            </Button>
          </Link>
        </div>
      </div>

      {/* Product Table */}
      <div>
        <ProductTable products={mockProducts} />
      </div>
    </div>
  );
}
