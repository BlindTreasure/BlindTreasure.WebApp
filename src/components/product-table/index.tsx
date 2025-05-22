import React from "react";
import { Button } from "@/components/ui/button";
import { Pencil, Trash2 } from "lucide-react";

export type Product = {
  id: number;
  name: string;
  price: string;
  stock: number;
  status: "Hiển thị" | "Ẩn";
  image: string;
};

type ProductTableProps = {
  products: Product[];
};

export default function ProductTable({ products }: ProductTableProps) {
  return (
    <div className="space-y-4">
      {/* Bảng cho màn hình md trở lên */}
      <div className="hidden md:block overflow-x-auto rounded-lg border border-gray-200 shadow-sm px-2 sm:px-4">
        <table className="w-full min-w-[700px] bg-white text-sm">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="px-4 py-3 text-left">Sản phẩm</th>
              <th className="px-4 py-3 text-left">Giá</th>
              <th className="px-4 py-3 text-left">Kho</th>
              <th className="px-4 py-3 text-left">Trạng thái</th>
              <th className="px-4 py-3 text-right">Hành động</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr
                key={product.id}
                className="border-t border-gray-200 hover:bg-gray-50"
              >
                <td className="px-4 py-3 flex items-center gap-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 min-w-[48px] rounded object-cover"
                  />
                  <span className="font-medium text-gray-900 break-words">
                    {product.name}
                  </span>
                </td>
                <td className="px-4 py-3">{product.price}</td>
                <td className="px-4 py-3">{product.stock}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-semibold px-2 py-1 rounded-full ${
                      product.status === "Hiển thị"
                        ? "bg-green-100 text-green-800"
                        : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {product.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-right space-x-2">
                  <Button variant="outline" size="sm">
                    <Pencil size={16} className="mr-1" /> Sửa
                  </Button>
                  <Button variant="destructive" size="sm">
                    <Trash2 size={16} className="mr-1" /> Xoá
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Card responsive cho mobile */}
      <div className="md:hidden space-y-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="rounded-lg border border-gray-200 p-4 shadow-sm flex gap-4 bg-white"
          >
            <img
              src={product.image}
              alt={product.name}
              className="w-16 h-16 rounded object-cover flex-shrink-0"
            />
            <div className="flex-1 space-y-1">
              <div className="font-medium text-gray-900">{product.name}</div>
              <div className="text-sm text-gray-700">Giá: {product.price}</div>
              <div className="text-sm text-gray-700">Kho: {product.stock}</div>
              <div className="text-sm">
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded-full ${
                    product.status === "Hiển thị"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-200 text-gray-700"
                  }`}
                >
                  {product.status}
                </span>
              </div>
              <div className="pt-2 space-x-2">
                <Button variant="outline" size="sm">
                  <Pencil size={16} className="mr-1" /> Sửa
                </Button>
                <Button variant="destructive" size="sm">
                  <Trash2 size={16} className="mr-1" /> Xoá
                </Button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
